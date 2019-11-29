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

module.exports.addImage = function(image_url, id) {
    return db.query("UPDATE socialusers set image_url = ($1) WHERE id = ($2)", [
        image_url,
        id
    ]);
};

module.exports.getUser = function(id) {
    return db.query("SELECT * FROM socialusers WHERE id = $1", [id]);
};
