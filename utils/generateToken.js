const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id) => {
    return jwt.sign({id: id}, process.env.SECRET_KEY, {expiresIn: '1h'});
}

module.exports = generateToken;