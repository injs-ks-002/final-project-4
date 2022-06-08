const {check, validationResult} = require('express-validator');
const {User} = require('../models/index')

const rules = [
    check('full_name', "harus string") 
            .notEmpty()
            .isString()
            .trim()
            .escape(),

    check('email')
            .notEmpty()
            .isEmail()
            .trim()
            .escape(),

    check('username')
            .custom(value => {
                return User.findOne({
                   where: {
                      username: value
                   }
                }).then(user => {
                   if (user) {
                      return Promise.reject('Username already in use')
                   }
                })
            })
            .notEmpty()
            .trim()
            .escape(),

    check('profile_image_url')
            .notEmpty()
            .isURL()
            .trim()
            .escape(),

    check('age')
            .notEmpty()
            .isInt()
            .trim()
            .escape(),

    check('phone_number')
            .notEmpty()
            .isInt()
            .trim()
            .escape(),
];

module.exports = {rules}