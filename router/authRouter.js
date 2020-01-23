const express = require('express')
const {authController} = require('../controller')

const router = express.Router()

router.get('/hashpassword', authController.belajarcrypto)
router.get('/sendmail', authController.sendmail)
router.post('/register', authController.register)
router.post('/registerserver', authController.registerserver)
router.put('/verifikasiemail',authController.emailverifikasi)


module.exports=router

