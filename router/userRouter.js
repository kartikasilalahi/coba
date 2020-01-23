const express=require('express')
const {userController} = require('../controller')

const router=express.Router()

router.get('/users', userController.getUser)
router.post('/adduser', userController.postUser)
router.put('/edituser/:id', userController.putUser)
router.delete('/deleteuser/:id', userController.deleteUser)

module.exports=router