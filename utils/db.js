var spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/social"
);

module.exports.register = function(firstname, lastname, email, password) {
    return db.query(
        "INSERT INTO socialusers (firstname, lastname, email, password) VALUES($1, $2, $3, $4) RETURNING *",
        [firstname, lastname, email, password]
    );
};

module.exports.getUserInfo = function getUserInfo(email) {
    return db.query("SELECT password, id FROM socialusers WHERE email = $1", [
        email
    ]);
};
