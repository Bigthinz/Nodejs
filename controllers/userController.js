const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')



const filteredObj = (obj, ...allowedFields)=>{
	const newObj= {}
	Object.keys(obj).forEach((el) =>{
		if(allowedFields.includes(el)){
			newObj[el] = obj[el]
		}
	})
	return newObj
}


//EXPORTING USER ROUTE RESPONDS

exports.getAllUsers = catchAsync( async (req,res,next)=>{

	//Initial way of getting all users

	/*res.status(500).json({
		status: 'error',
		message:'This route is not define yet'
	})*/


	//Get all users exlcuding their password field
	const users = await User.find()

	res.status(200).json({
		status:"sucess",
		length: users.length,
		data:{
			users
		}

	})
})


//updating logged-Inn user data
exports.updateMe = catchAsync( async(req,res,next)=>{

	//CREATE ERROR IF USER POSTS PASSWORD DATA
	if(req.body.password || req.body.confirmPassword){
		return next(new AppError('This route is not for password update. Please use /updateMyPassword', 400))
	}


	//filtered of field names that are not to be updated
	const filteredBody = filteredObj(req.body, 'name', 'email')

	//UPDATE USER DOCUMENT
	const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
		new:true,
		runValidators:true
	})

	res.status(200).json({
		status:'success',
		data:{
			user:updatedUser
		}
	})
})


exports.deleteMe = catchAsync(async (req,res,next)=>{
	await User.findByIdAndUpdate(req.user.id, {active: false})

	res.status(204).json({
		status:"success",
		data: null
	})
})


exports.getUser = (req,res)=>{
	res.status(500).json({
		status: 'error',
		message:'This route is not define yet'
	})
}



exports.createUser = (req,res)=>{
	res.status(500).json({
		status: 'error',
		message:'This route is not define yet'
	})
}



exports.updateUser = (req,res)=>{
	res.status(500).json({
		status: 'error',
		message:'This route is not define yet'
	})
}


exports.deleteUser = factory.deleteOne(User)
