const express = require('express');
const {body} = require('express-validator');
const User = require('../models/user');
const controller = require('../controllers/user');
const isAuth = require('../middlewares/isAuth');
const isAdmin = require('../middlewares/isAdmin');
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
        .notEmpty(),
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
        })
        .notEmpty(),
    body('name')
        .trim()
        .isLength({min: 4})
        .isAlpha()
        .withMessage('not a valid name')
        .notEmpty()
]
, controller.signup);


router.get('/signin',
[
    body('email')
        .trim()
        .isEmail()
        .withMessage('email format is not correct!')
        .not()
        .isEmpty(),
    body('password')
        .trim()
        .isLength({min: 8})
        .not()
        .isEmpty()
        .withMessage('password is not correct!')
]
, controller.signin);

router.get('/profile', isAuth, controller.profile);

router.get('/admin', isAuth, isAdmin, controller.admin);

module.exports = router;