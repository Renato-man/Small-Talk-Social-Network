const express = require("express");
const app = express();

const compression = require("compression");
const csurf = require("csurf");
const cookieSession = require("cookie-session");
const db = require("./utils/db");
const { hash, compare } = require("./utils/bc");

app.use(express.static("public"));

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
        console.log("hash: ", hashedPassword);
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

app.get("/welcome", function(req, res) {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
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
