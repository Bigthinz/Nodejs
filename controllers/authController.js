const crypto = require('crypto')
const { promisify} = require('util')

const jwt = require('jsonwebtoken')

const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const sendMail = require('./../utils/email')

const signToken = (id)=>{
	return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE_IN})
}

const createSendToken = (user, statusCode, res)=>{
	const token = signToken(user._id)

	res.status(statusCode).json({
		status:"success",
		token,
		data:{
			user
		}
	})
}

exports.signup = catchAsync(async(req,res,next)=>{
	const newUser = await User.create(req.body)

	createSendToken(newUser, 201, res)
	
})

exports.login = catchAsync(async (req,res,next)=>{


	const {email,password} = req.body

	
	// 1) check if email and password exist
	if(!email || !password){
		return next(new AppError('please provide email and password',400))
	}

	// 2) Check if user exit or password is correct
	const user = await User.findOne({email}).select('+password')
	// console.log(user)

	//calling the global method correctPassword difine in the userModel without use require() cuz is available on all documents 
	/*const correct = await user.correctPassword(password, user.password)*/

	if(!user || !(await user.correctPassword(password, user.password))){
		return next(new AppError('Invalid password or email', 401))
	}


	// 3) if everythilng is ok send to client
	createSendToken(user, 200, res)

	// const token = signToken(user._id)
	// res.status(200).json({
	// 	status: 'sucess',
	// 	token

	// })
})

exports.protect = catchAsync( async (req,res,next)=>{
	// 1) GETTING TOKEN AND CHECK IF ITS AVAILABLE
	let token

	if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
		token =  req.headers.authorization.split(" ")[1]
	}
	// console.log(token)

	if(!token){
		return next( new AppError('You are not logged in! Please log in to get access', 401))
	}

	// 2) Verification of TOKEN
	const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
	console.log(decoded)

	// 3) check if USER still exit
	const currentUser = await User.findById(decoded.id)
	



	if(!currentUser){
		return next( new AppError('The user belonging to this token does not exit', 401))
	}


	// 4) check if user changed password after token was issued
	 if(currentUser.changedPasswordAfter(decoded.iat)){
	 	return next( new AppError('User reciently changed password. Please login again', 401))
	 }

	req.user = currentUser

	//GRANT ACCESS TO PROTECTIVE ROUTE
	next()
})


exports.restrictTo = (...roles) =>{
	return (req,res,next)=>{
		console.log(req.user.role)
		// roles is [admin, lead-guide] and role is user
		if(!roles.includes(req.user.role)){
			return next( new AppError('You do not have permission to perform this action', 403))
		}

		console.log('hey use it')

		next() 
	}
}

exports.forgotPassword = catchAsync(async(req,res,next)=>{
	//Get user based on posted email
	const user = await User.findOne({email: req.body.email})

	if(!user){
		return next( new AppError('There is no user with that email address', 404))
	}

	//Generate random reset token
	const resetToken = user.createPasswordResetToken()
	await user.save({validateBeforeSave:false})


	//send it to the user's email
	const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
	const message = ` Forgot password? Please submit a PATCH request with new password and passwordconfirm to: ${resetURL}.\n if you didnt forget your password please ignore this email.`


	try{  	 
	await sendMail({
		email: user.email,
		subject:'Your password reset token (valid for 10min)',
		message
	})

	res.status(200).json({
		status:'success',
		message: 'Token sent to email!'
	})
}catch(err){
	user.passwordResetToken = undefined
	user.passwordResetExpires = undefined
	await user.save({validateBeforeSave:false})

	return next(new AppError('There was an error sending email!!', 500))
}


})








exports.resetPassword = catchAsync(async(req,res,next)=>{
	//Get user based on token
	const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

	const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}})

	//If token has not expired and there is user set the new password
	if(!user){
		return next(new AppError('Token is invalid or expired',400))
	}

	user.password = req.body.password
	user.confirmPassword = req.body.confirmPassword
	user.passwordResetToken =undefined
	user.passwordResetExpires = undefined
	await user.save()

	

	//Update changed changedPasswordAt for the user  ----check useModel isModified two(2)

	//Log the user in....and send JWT
	createSendToken(user, 200, res)

	// const token = signToken(user._id)

	// res.status(200).json({
	// 	status:"success",
	// 	token
		
	// })
})


exports.updatePassword =  catchAsync(async(req,res,next)=>{
	//Get user from collection
	const user = await User.findById(req.user.id).select('+password')

	//check if posted current password is correct
	if(! (await user.correctPassword(req.body.currentPassword, user.password))){
		return next( new AppError('Your corrent password is wrong', 401))
	}


	//if so, update password
	user.password =  req.body.password
	user.confirmPassword = req.body.confirmPassword
	await user.save()

	//log user in....send JWT
	createSendToken(user, 200, res)
})