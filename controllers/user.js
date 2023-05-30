const User = require('../models/user');
const {validationResult} = require('express-validator');

exports.signup = async (req, res, next) => {
    try {
        const error = validationResult(req);
        if(!error.isEmpty()){
            error.statusCode = 422;
            throw error;
        }
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;

        const user = new User({
            email: email,
            password: password,
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
        res.status(err.statusCode).json(err.array());
    }
}