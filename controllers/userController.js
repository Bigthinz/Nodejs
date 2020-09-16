const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')


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


exports.deleteUser = (req,res)=>{
	res.status(500).json({
		status: 'error',
		message:'This route is not define yet'
	})
}
