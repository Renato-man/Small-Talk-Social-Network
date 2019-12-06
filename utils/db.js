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

module.exports.setBio = function(id, bio) {
    return db.query(
        "UPDATE socialusers SET bio = $2 WHERE id = $1 RETURNING bio",
        [id, bio]
    );
};

module.exports.getOther = function(id) {
    return db.query("SELECT * FROM socialusers WHERE id = $1", [id]);
};

module.exports.findPeople = function() {
    return db.query(
        "SELECT firstname, lastname, image_url, id FROM socialusers ORDER BY id DESC LIMIT 3",
        []
    );
};

module.exports.search = function(val) {
    return db.query(
        `SELECT firstname, lastname, image_url FROM socialusers WHERE firstname ILIKE $1 OR lastname ILIKE $1`,
        [val + "%"]
    );
};

module.exports.checkFriendship = function(receiver_id, sender_id) {
    return db.query(
        `SELECT * FROM friendships
WHERE (receiver_id = $1 AND sender_id = $2)
OR (receiver_id = $2 AND sender_id = $1)`,
        [receiver_id, sender_id]
    );
};

module.exports.addFriend = function(receiver_id, senderid) {
    return db.query(
        `INSERT INTO friendships (receiver_id, sender_id) VALUES ($1, $2)`,
        [receiver_id, senderid]
    );
};

module.exports.accept = function(receiver_id, senderid) {
    return db.query(
        `UPDATE friendships SET accepted = true WHERE receiver_id = $1 AND sender_id = $2
        OR receiver_id = $2 AND sender_id = $1`,
        [receiver_id, senderid]
    );
};

module.exports.delete = function(receiver_id, senderid) {
    return db.query(
        `DELETE FROM friendships WHERE receiver_id = $1 AND sender_id = $2
        OR receiver_id = $2 AND sender_id = $1`,
        [receiver_id, senderid]
    );
};
