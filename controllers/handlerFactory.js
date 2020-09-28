const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const APIFeatures = require('./../utils/apiFeatures')




exports.deleteOne = (Model) => catchAsync(async (req,res,next)=>{
	
	const doc = await Model.findByIdAndDelete(req.params.id)	


	if(!doc){
	 return next(new AppError('No document found with that ID',404))
	}

		res.status(204).json({
		status:'success',
		data: null
	})
	
})



exports.updateOne = Model => catchAsync(async (req,res,next)=>{
	
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new:true,
			runValidators:true
		})	


	if(!doc){
		return next(new AppError('No document found with that ID',404))
	}
		res.status(200).json({
			status:'success',
			data:{
				data:doc
			}
		})

})



exports.createOne = Model =>  catchAsync(async (req,res,next)=>{
	
		 const doc = await Model.create(req.body)

		res.status(201).json({
	 		status:'sucess',
	 		data:{
	 			data: doc
	 		}
	 	})
	
	})

	

exports.getOne = (Model, popOptions) =>  catchAsync(async (req,res,next)=>{
	//getting tour
	let query = Model.findById(req.params.id)

	//get tour if populate is in the query
	if(popOptions) query = query.populate(popOptions)

	const doc = await query

	if(!doc){
		return next(new AppError('No document found with that ID',404))
	}

	res.status(200).json({
		status:'sucess',
		result: doc.length,
		data:{
			data: doc
		}
	})
})


exports.getAll = Model => catchAsync(async (req,res,next)=>{
	
			//filter for a review when it has an ID
			//TO ALLOW FOR NESTED GET REVIEWS ON TOUR (HACK)
		let filter = {}
		//if filter is null it will display all reviews

		if(req.params.tourId) filter = {tour : req.params.tourId}

		//CALLING CLASS OF DATABASE QUERYING	
		const features = new APIFeatures(Model.find(filter),req.query)
						.filter()
						.sort()
						.fieldLimit()
						.paginate()

		const doc = await features.query
		
		res.status(200).json({
			status:'sucess',
			result: doc.length,
			data:{
				data:doc
				}
			})
})








