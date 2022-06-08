const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller')
router.use(express.json())
const {rules} = require('../middleware/validasiUser')
const verify = require('../middleware/auth').verify


router.post('/register',rules, controller.signUp);
router.post('/login', controller.signIn);
router.put('/:userId',verify, controller.updateUser);
router.delete('/:userId',verify, controller.deleteUser);
module.exports = router;