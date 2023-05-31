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

exports.signin = async (req, res, next) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            const err = new Error('validation failed!');
            err.statusCode = 422;
            throw err;
        }

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email });
        if (!user) {
            const err = new Error('email not found!');
            err.statusCode = 401;
            throw err;
        }

        const isMatch = await bcrypt.compare(password, user.hashedPw);
        if (!isMatch) {
            const err = new Error('Password is wrong!');
            err.statusCode = 401;
            throw err;
        }

        console.log('sign in success');
        res.status(200).json(user);
    } catch(err) {
        res.status(err.statusCode).json({
            message: err.message[0].msg
        });
    }
    
}