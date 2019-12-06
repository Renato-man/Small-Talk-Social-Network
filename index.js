const express = require("express");
const app = express();
const compression = require("compression");
const csurf = require("csurf");
const cookieSession = require("cookie-session");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bc");
const s3 = require("./s3");
const multer = require("multer");
const path = require("path");
const uidSafe = require("uid-safe");
const { s3Url } = require("./config");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.static("public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(
    cookieSession({
        secret: `I'm always angry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

app.use(compression());

app.use(express.json());

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.post("/register", (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;

    hash(password).then(hashedPassword => {
        // console.log("hash: ", hashedPassword);
        db.register(firstname, lastname, email, hashedPassword)
            .then(results => {
                req.session.user = results.rows[0].id;
                res.json({ success: true });
            })
            .catch(err => {
                console.log(err);
                res.json({
                    error: "Please fill in all empty fields."
                });
            });
    });
});

app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    db.getUserInfo(email)
        .then(results => {
            let hashedPass = results.rows[0].password;
            let user_id = results.rows[0].id;
            compare(password, hashedPass)
                .then(match => {
                    if (match) {
                        req.session.user = user_id;
                        res.json({ success: true });
                    }
                })
                .catch(reason => console.log("catch 1", reason));
        })
        .catch(reason => {
            console.log("catch 2", reason);
            res.json({
                error: "incorrect password and/or email"
            });
        });
});

app.post("/bio", (req, res) => {
    console.log("req.bodyyyy....", req.body);
    db.setBio(req.session.user, req.body.bio)
        .then(results => {
            // console.log("resuuuuuuuuuuuuuults", results);
            res.json(results.rows);
        })
        .catch(err => {
            console.log("error in updating bio: ", err);
            res.json({
                success: false
            });
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const imageUrl = `${s3Url}/${req.file.filename}`;
    // console.log("hello", imageUrl);
    let id = req.session.user;
    db.addImage(imageUrl, id)
        .then(({ rows }) => {
            console.log(rows);
            res.json({ imageUrl });
        })
        .catch();
});

app.get("/welcome", function(req, res) {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/getUser", (req, res) => {
    let id = req.session.user;
    db.getUser(id)
        .then(({ rows }) => {
            // console.log("db response from getUser route: ", rows);
            res.json(rows[0]);
        })
        .catch();
});

app.get("/api/user/:id", (req, res) => {
    let id = req.params.id;
    db.getOther(id).then(({ rows }) => {
        // console.log("this is the rows: ", rows);
        res.json({ user: rows[0], id: req.session.user });
    });
});

app.get("/find", (req, res) => {
    let id = req.params.id;
    db.findPeople(id)
        .then(({ rows }) => {
            // console.log("this is the db response rows in find: ", rows);
            res.json(rows);
        })
        .catch();
});

app.post("/send-friend-request/:otherId", (req, res) => {
    console.log("server", req.params.otherId, req.session.user);
    return db
        .addFriend(req.params.otherId, req.session.user)
        .then(() => {
            res.json({
                buttontext: "Cancel Friend Request"
            });
        })
        .catch(err => {
            console.log("err in post send friend: ", err);
        });
});

app.post("/accept-friend-request/:otherId", (req, res) => {
    console.log("server accpet !!!!!", req.params.otherId, req.session.user);
    db.accept(req.params.otherId, req.session.user)
        .then(() => {
            console.log(
                "in server accept friend",
                req.params.otherId,
                req.session.user
            );

            res.json({
                buttontext: "Unfriend"
            });
        })
        .catch(err => {
            console.log("err in accpet friend: ", err);
        });
});

app.get("/friendshipStatus/:otherId", (req, res) => {
    // console.log("check friendship: ", req.params.otherId);
    db.checkFriendship(req.params.otherId, req.session.user)
        .then(result => {
            console.log("checked friendship");

            if (result.rows.length > 0) {
                if (result.rows[0].sender_id === req.session.user) {
                    if (result.rows[0].accepted === true) {
                        res.json({
                            buttontext: "Unfriend"
                        });
                        return;
                    }
                    res.json({
                        buttontext: "Cancel Friend Request"
                    });
                    return;
                }
                if (result.rows[0].accepted === true) {
                    res.json({
                        buttontext: "Unfriend"
                    });
                    return;
                }
                res.json({
                    buttontext: "Accept Friend Request"
                });
                return;
            }

            res.json({
                buttontext: "Send Friend Request"
            });
        })
        .catch(err => console.log("not working", err));
});

app.post("/deleteFriendship/:otherId", (req, res) => {
    console.log("delete friendship: ", req.params.otherId);
    db.delete(req.params.otherId, req.session.user)
        .then(() => {
            // console.log("checked friendship");
            res.json({
                buttontext: "Send Friend Request"
            });
        })
        .catch(err => console.log("not working", err));
});

// app.post("/requestFriendship", (req, res) => {
//     console.log("requesting friendship with receiver:", req.body.otherId);
//     db.sendFriendRequest(req.body.otherId, req.session.user)
//         .then(result => {
//             res.json({
//                 buttonText: "Cancel Friend Request"
//             });
//         })
//         .catch(console.log("error in cancel friendrequest"));
// });

app.get("/findpeople/:val", (req, res) => {
    console.log(req.params);
    let val = req.params.val;

    db.search(val)
        .then(({ rows }) => {
            console.log("SEARCH!!!!!!!!!!!!!!: ", rows);
            res.json(rows);
        })
        .catch();
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome#/login");
});

app.get("*", function(req, res) {
    if (!req.session.user) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// app.get("*", function(req, res) {
//     res.sendFile(__dirname + "/index.html");
// });

app.listen(8080, function() {
    console.log("I'm listening.");
});

//
// app.get("/checkforfriendship", (req, res) => {
//     console.log("id i check for friendreqeusts", req.query.otherId);
//     databaseActions
//         .checkingFriendshipStatus(req.query.otherId, req.session.userId)
//         .then(result => {
//             console.log("checked friendship status");
//             if (result.rowCount === 0) {
//                 res.json({
//                     buttonText: "send friendrequest",
//                     friendshipStatus: ""
//                 });
//             }
//             if (result.rowCount > 0) {
//                 if (result.rows[0].accepted === true) {
//                     res.json({
//                         buttonText: "cancel friendship",
//                         friendshipStatus: "friends"
//                     });
//                 } else if (result.rows[0].accepted === false) {
//                     if (result.rows[0].receiver_id === req.session.userId) {
//                         res.json({
//                             buttonText: "accept friendrequest",
//                             friendshipStatus: "they wanna be friends with u!"
//                         });
//                     } else if (
//                         result.rows[0].sender_id === req.session.userId
//                     ) {
//                         res.json({
//                             buttonText: "cancel friendrequest",
//                             friendshipStatus:
//                                 "u asked them for friendship and they havent answered yet"
//                         });
//                     }
//                 }
//             }
//         })
//         .catch(err => console.log("not doing sql correctly", err));
// });
// app.post("/requestfriendship", (req, res) => {
//     console.log("requesting friendship with receiver id:", req.body.otherId);
//     databaseActions
//         .sendFriendRequest(req.body.otherId, req.session.userId)
//         .then(result => {
//             res.json({
//                 buttonText: "cancel friendrequest",
//                 friendshipStatus:
//                     "u asked them for friendship and they havent answered yet"
//             });
//         })
//         .catch(console.log("handling error in cancel friendrequest"));
// });
// app.post("/cancelfriendship", (req, res) => {
//     databaseActions
//         .cancelFriendship(req.body.otherId, req.session.userId)
//         .then(result => {
//             res.json({
//                 buttonText: "send friendrequest",
//                 friendshipStatus: "not friends"
//             });
//         })
//         .catch(console.log("handling error in send friendrequest"));
// });
// app.post("/acceptfriendship", (req, res) => {
//     databaseActions
//         .acceptFriendship(req.body.otherId, req.session.userId)
//         .then(result => {
//             res.json({
//                 buttonText: "cancel friendship",
//                 friendshipStatus: "friends"
//             });
//         })
//         .catch(console.log("handling error in accept friendrequest"));
// });
