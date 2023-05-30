const express = require('express');
const {body} = require('express-validator');
const User = require('../models/user');
const controller = require('../controllers/user');
const router = express.Router();

router.post('/signup',
[
    body('email')
        .trim()
        .isEmail()
        .withMessage('email format is not correct!')
        .custom((value, {req}) => {
            return User.findOne({email: value})
                .then(user => {
                    if(user){
                        return Promise.reject('email already exist!');
                    }
                })
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 8 })
        .withMessage('password is not strong enough!')
        .not()
        .isUppercase()
        .not()
        .isLowercase()
        .not()
        .isAlphanumeric()
        .custom((value, {req}) => {
            if(value !== req.body.confirm_password){
                return Promise.reject('password is not match!');
            }
            return true;
        }),
    body('name')
        .trim()
        .isLength({min: 4})
        .withMessage('not a valid name')
]
, controller.signup);

module.exports = router;