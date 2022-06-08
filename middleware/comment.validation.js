const { check } = require('express-validator')

const validation = [
    check('comment')
    .isString()
    .withMessage('Comment must be string')
    .notEmpty()
    .withMessage('Comment must be not empty'),
    check('PhotoId')
    .isInt()
    .withMessage('Photo Id must be integer number')
    .notEmpty()
    .withMessage('Photo Id must be not empty')
]

const validationForPut = [
    check('comment')
    .isString()
    .withMessage('Comment must be string')
    .notEmpty()
    .withMessage('Comment must be not empty')
]

module.exports = {
    validation, validationForPut
}