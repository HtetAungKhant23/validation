const User = require('../models/user');
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

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
        // res.status(err.statusCode).json({
        //     message: err.message[0].msg
        // });
        next(err);
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
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const err = new Error('Password is wrong!');
            err.statusCode = 401;
            throw err;
        }
        res.status(200).json({
            message: 'successfully login!',
            user: user,
            token: generateToken(user._id)
        });
    } catch(err) {
        console.log('hiihi');
        next(err);
    }
}

exports.profile = async (req, res, next) => {
    try {
        const user = await User.findById(req.userAuth);
        res.status(200).json({
            message: 'profile view success!',
            user: user
        });
    } catch (err) {
        next(err);
    }
}

exports.admin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userAuth);
        res.status(200).json({
            message: 'welcome from admin dashboard!',
            user: user
        });
    } catch (err) {
        next(err);
    }
}