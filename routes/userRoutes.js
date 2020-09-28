const express = require('express')

//REQUIRING ROUTES RESPONDS FROM CONTROLLER FOLDER "userController.js"
const {getUser, getMe,createUser,getAllUsers,updateUser,deleteUser, updateMe, deleteMe} = require('./../controllers/userController')
const {signup, login, resetPassword,restrictTo, forgotPassword, protect, updatePassword} = require('./../controllers/authController')

//USING MIDDLEWARE TO PROCESS ROUTES
router = express.Router()


//ROUTES WITH REFERENCE FROM CONTROLLERS FOLDER "userController.js"

router.post('/signup', signup)
router.post('/login', login)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token',resetPassword)

//this middleware automatically protects all routes that comes after it NOTE!!...because middleware runs in sequence
router.use(protect)

//note  I removed protect from the rest of the route bcus of the router.use(protect)
//router.patch('/updateMyPassword', protect, updatePassword)

router.patch('/updateMyPassword', updatePassword)
router.patch('/updateMe',  updateMe)

router.get('/me', getMe, getUser)

router.delete('/deleteMe', deleteMe)

//restrict routes after middleware  to anly ADMIN only to perform
router.use(restrictTo('admin'))

router.route('/')
   .get(getAllUsers)
   .post(createUser)

router.route('/:id')
   .get(getUser)
   .patch(updateUser)
   .delete(deleteUser)


 module.exports = router