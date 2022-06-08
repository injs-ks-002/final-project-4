const express = require('express');
const router = express.Router();
const controller = require('../controllers/comment.controller')
const auth = require('../middleware/auth')
const comment = require('../middleware/comment.validation')

router.post('/', auth.verify, comment.validation, controller.postComment)
router.get('/', auth.verify, controller.getAllComment)
router.put('/:commentId', auth.verify, comment.validationForPut, controller.putComment)
router.delete('/:commentId', auth.verify, controller.deleteComment)

module.exports = router