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
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

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

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(compression());
app.use(express.static("./assets"));
app.use(express.json());
app.use(express.static("./utils"));
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
    console.log("imageurl: ", imageUrl);
    let id = req.session.user;
    db.addImage(imageUrl, id)
        .then(({ rows }) => {
            console.log(rows);
            res.json({ imageUrl });
        })
        .catch(err => {
            console.log(err);
        });
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
            res.json(rows[0]);
        })
        .catch();
});

app.get("/api/user/:id", (req, res) => {
    let id = req.params.id;
    db.getOther(id).then(({ rows }) => {
        res.json({ user: rows[0], id: req.session.user });
    });
});

app.get("/find", (req, res) => {
    let id = req.params.id;
    db.findPeople(id)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch();
});

app.post("/send-friend-request/:otherId", (req, res) => {
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
    db.checkFriendship(req.params.otherId, req.session.user)
        .then(result => {
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
    db.delete(req.params.otherId, req.session.user)
        .then(() => {
            res.json({
                buttontext: "Send Friend Request"
            });
        })
        .catch(err => console.log("not working", err));
});

app.get("/findpeople/:val", (req, res) => {
    let val = req.params.val;
    db.search(val)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch();
});

app.get("/friends-wannabes", (req, res) => {
    db.getFriendAndWannabes(req.session.user)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => console.log("err in app.get friends-wannabes", err));
});

app.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("*", function(req, res) {
    if (!req.session.user) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

io.on("connection", socket => {
    console.log(`socket with the id ${socket.id} just connected`);
    const user = socket.request.session.user;
    socket.on("load", () => {
        db.getLastTenChatMessages()
            .then(({ rows }) => {
                socket.emit("chatMessages", rows.reverse());
            })
            .catch(err => console.log(err));
    });

    socket.on("My amazing chat message", msg => {
        db.insertMessage(user, msg)
            .then(() => {
                db.getLastTenChatMessages().then(({ rows }) => {
                    socket.emit("chatMessages", rows.reverse());
                });
            })
            .catch(err => console.log(err));
    });

    socket.on("disconnect", () => {
        console.log(`socket with id ${socket.id} just diconnected `);
    });
});
