const AppError = require('./../utils/appError')

const handleCastErrorDB = err =>{
  let message = `Invalid ${err.path}: ${err.value}`

  return  new AppError(message,400)
}

const handleDuplicateErrorDB = err =>{
  const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0]
  let message = `Duplicate field value: ${value}. Please use another value!`
  return new AppError(message,404)
}

const handleValidatorErrorDB = err =>{
  const errors = Object.values(err.errors).map(el => el.message)
  const message = `Invalid input data. ${errors.join('. ')}`

  return new AppError(message,400)
}

//HANDLING JWT TOKEN ERRORS
const handleJWTError = err => new AppError('Invalid Token!. Please log in again',401)
const handeleExpiredError = err => new AppError('Your token has expired!. Please login again',401)

//GRABBING ERRORS WHEN IN DEVELOPMENT MODE
const sendErrorDev = (err,res)=>{
	  res.status(err.statusCode).json({
      status: err.statusCode,
      error: err,
      message: err.message,
      stack: err.stack
   })
}

//GRABBING ERROR WHEN IN PRODUCTION MODE
const sendErrorProd = (err,res)=>{
	//OPERATIONAL, TRUSTED ERROR: SENDS MESSAGE TO CLIENT 
	if(err.isOperational){
		 res.status(err.statusCode).json({
		status: err.statusCode,
     	 message: err.message
  	   })   
	//PROGRAMMING OR UNKNOWNED ERROR: DONT LEAK ERROR DETAILS TO CLIENT	 
	}else{
		// 1) LOG ERROR
		console.error('Error',err)

		// 2) SEND GENERIC MESSAGE
		 res.status(500).json({
     	 status: 'error',
   		 message: 'Something went wrong'
  	 	})
	}

	//INITIAL WAY OF HANDLING PROD ERROR
	 /* res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
   })*/
}

module.exports = (err,req,res,next)=>{
   
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'


    if(process.env.NODE_ENV === 'development'){
    
    	 sendErrorDev(err,res)

    }else if(process.env.NODE_ENV === 'production'){

    let error = {...err}
    

    if(error.name === 'CastError') error = handleCastErrorDB(error) 

    if(error.code === 11000) error = handleDuplicateErrorDB(error) 

    if(error.name === 'ValidationError') error = handleValidatorErrorDB(error) 

    if(error.name === 'JsonWebTokenError') error = handleJWTError(error)

    if(error.name === 'TokenExpiredError') error = handeleExpiredError(error)


 

		sendErrorProd(error,res)

    }


 
}







