const Review = require('./../models/reviewModel')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')



exports.getAllReviews = catchAsync(async (req,res,next)=>{

	//filter for a review when it has an ID
	let filter = {}
	//if filter is null it will display all reviews

	if(req.params.tourId) filter = {tour : req.params.tourId}

	const reviews = await Review.find(filter)

	res.status(200).json({
		status: 'success',
		results: reviews.length,
		data:{
			reviews
		}
	})
})


exports.createReview = catchAsync(async (req,res,next)=>{

	console.log(req.params)
	//ALLOW NESTED ROUTES
	if(!req.body.tour){
		req.body.tour = req.params.tourId
	}



	if(!req.body.user){
		req.body.user = req.user.id
	}


	const newReview = await Review.create(req.body)

	res.status(201).json({
		status:'success',
		data:{
			newReview:newReview
		}
	})
})


exports.deleteReview = factory.deleteOne(Review)


