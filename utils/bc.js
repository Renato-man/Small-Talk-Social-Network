const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const hash = promisify(bcrypt.hash);
const genSalt = promisify(bcrypt.genSalt);

exports.hash = function(password) {
    return genSalt().then(salt => {
        return hash(password, salt);
    });
};

exports.compare = promisify(bcrypt.compare);
