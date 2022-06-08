const express = require('express');
const router = express.Router();
const controller = require('../controllers/photos.controller')
const auth = require('../middleware/auth')
const photo = require('../middleware/photo.validation')

router.get('/', auth.verify, controller.getPhoto)
router.post('/', auth.verify, photo.validation, controller.postPhoto)
router.put('/:photoId', auth.verify, photo.validation, controller.updatePhoto)
router.delete('/:photoId', auth.verify, controller.deletePhoto)
module.exports = router;