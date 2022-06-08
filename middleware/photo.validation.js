const {check} = require('express-validator')

const validation = [
    check('poster_image_url', 'Poster image url must be string url and not empty')
        .isURL()
        .notEmpty(),
    check('title', 'Title must be string and not empty')
        .isString()
        .notEmpty(),
    check('caption', 'Caption must be string and not empty')
        .isString()
        .notEmpty()
]

module.exports = { validation }