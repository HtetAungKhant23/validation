const User = require('../models/user');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res, next) => {
    try {
        const error = validationResult(req);
        if(!error.isEmpty()){
            const err = new Error('validation failed!');
            err.statusCode = 422;
            err.message = error.array();
            throw err;
        }
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;

        const salt = await bcrypt.genSalt(10);
        const hashedPw = await bcrypt.hash(password, salt);
    
        const user = new User({
            email: email,
            password: hashedPw,
            name: name
        });

        const new_user = await user.save();
        if (!new_user) {
            const err = new Error('new user cannot sign up!');
            throw err;
        }

        res.status(201).json({
            message: 'successfully signup!',
            user: new_user
        })

    } catch(err) {
        res.status(err.statusCode).json({
            message: err.message[0].msg
        });
    }
}