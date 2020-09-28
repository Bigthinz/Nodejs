const express = require('express')

//REQUIRING ROUTES RESPONDS FROM CONTROLLER FOLDER "userController.js"
const {getUser, getMe,createUser,getAllUsers,updateUser,deleteUser, updateMe, deleteMe} = require('./../controllers/userController')
const {signup, login, resetPassword, forgotPassword, protect, updatePassword} = require('./../controllers/authController')

//USING MIDDLEWARE TO PROCESS ROUTES
router = express.Router()


//ROUTES WITH REFERENCE FROM CONTROLLERS FOLDER "userController.js"

router.post('/signup', signup)
router.post('/login', login)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token',resetPassword)
router.patch('/updateMyPassword', protect, updatePassword)

router.get('/me', protect, getMe, getUser)

router.patch('/updateMe', protect, updateMe)

router.delete('/deleteMe', protect, deleteMe)

router.route('/')
   .get(getAllUsers)
   .post(createUser)

router.route('/:id')
   .get(getUser)
   .patch(updateUser)
   .delete(deleteUser)


 module.exports = router