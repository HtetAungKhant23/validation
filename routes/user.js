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
        .normalizeEmail()
]
, controller.signup);

module.exports = router;