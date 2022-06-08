const express = require('express');
const router = express.Router();
const controller = require('../controllers/socialmedia.controller')
const auth = require('../middleware/auth')
const socialmedia = require('../middleware/socialmedia.validation')

router.post('/', auth.verify, socialmedia.validation, controller.postSocialMedia)
router.get('/', auth.verify, controller.getAllSocialMedia)
router.put('/:socialMediaId', auth.verify, socialmedia.validation, controller.putSocialMedia)
router.delete('/:socialMediaId', auth.verify, controller.deleteSocialMedia)

module.exports = router