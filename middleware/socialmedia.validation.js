const { check } = require('express-validator')

const validation = [
    check('name', 'Name must be string and not empty')
    .isString()
    .notEmpty(),
    check('social_media_url', 'Social media url must be string url and not empty')
    .isURL()
    .notEmpty()
]

module.exports = { validation }