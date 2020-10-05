const fs = require('fs')
const Tour = require('./../models/tourModel')
// const APIFeatures = require('./../utils/apiFeatures')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')

//READING JSON FILE
/*const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))*/


//checking ID OF JSON TYPED IN THE BROWSER

/*
exports.checkID = (req,res,next,val)=>{
	console.log(`this is  ID: ${val}`)
	if(req.params.id * 1 > tours.length){
		res.status(404).json({  
			status: 'fail to delete',
			message: 'Invalid ID'
		})
	}
	next()
}*/
/*
exports.checkBody= (req,res,next)=>{
	if(!req.body.name || !req.body.price){
		return res.status(400).json({
			status:'fail',
			message:'missing name or price'
		})
	}
	next()
}

*/


exports.aliasTopTours = (req,res,next)=>{
	req.query.limit = '5',
	req.query.sort = '-ratingsAverage',
	req.query.fields = 'name,price,ratingsAverage,difficulty,summary'

	next()
}





//EXPORTING ROUTE RESPONDS



exports.getAllTours = factory.getAll(Tour)

//OLD WAY OF GETTING ALL TOURS BEFORE FACTORY HANDLER

// exports.getAllTours = catchAsync(async (req,res,next)=>{
	// try{
		/*console.log(req.query)
		const queryObj = {...req.query}
		const excludeField = ['page','sort','limit','fields']
		excludeField.forEach(el => delete queryObj[el])

		// console.log(req.query,queryObj)

		//ADVANCW FILTERING
		let queryStr = JSON.stringify(queryObj)
		queryStr = 	queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

		// console.log(JSON.parse(queryStr))


		let query =  Tour.find(JSON.parse(queryStr))*/

		//2) SORTING
		/*if(req.query.sort){
			const sortBy = req.query.sort.split(',').join(' ')
			// console.log(sortBy)

			query = query.sort(sortBy)
			//sort(price ratingsAverage)

		}else{
			query = query.sort('-createdAt')
		}*/

		//3) FIELD LIMITING
		/*if(req.query.fields){
			const fields = req.query.fields.split(',').join(' ')
			query = query.select(fields)
		}else{
			query = query.select('-__v')
		}
*/

		//4) PAGINATION
	/*	const page = req.query.page * 1 || 1
		const limit = req.query.limit * 1 || 100
		const skip = (page - 1) * limit

		query = query.skip(skip).limit(limit) 


		if(req.query.page){
			const numTours = await Tour.countDocuments()
			if(skip >= numTours) throw new Error('This page does not exist')
		}*/




		//CALLING CLASS OF DATABASE QUERYING	
		/*const features = new APIFeatures(Tour.find(),req.query)
						.filter()
						.sort()
						.fieldLimit()
						.paginate()

		const tours = await features.query*/
		

	//=---------one way of query or filtering your api

		// const tours = await Tour.find()
		// 	.where('duration')
		// 	.gte(5)


	//*---------another way
		/*const tours = await Tour.find({
			duration:5,
			difficulty:"easy"
		})*/


	/*res.status(200).json({
		status:'sucess',
		result: tours.length,
		data:{
			tours
			}
		})*/
	/*}catch(err){
		res.status(404).json({
			status:'Fail',
			message:err
		})
	}*/
	
// })


exports.getTour = factory.getOne(Tour, {path: 'reviews'})



//OLD WAY OF GETTING TOUR WITHOUT FACTORY HANDLER
// exports.getTour = catchAsync(async (req,res,next)=>{

// 	//GETING THE INPUT ID
// 	/*const id = req.params.id * */


// // try{
// 	//GETING A SINGLE ID
// 	const tour = await Tour.findById(req.params.id).populate('reviews')

// 	if(!tour){
// 		return next(new AppError('No tour found with that ID',404))
// 	}

// 	res.status(200).json({
// 		status:'sucess',
// 		result: tour.length,
// 		data:{
// 			tour
// 		}
// 	})
// })





	/*
	const tour = tours.find(el => el.id === id)

	// if(id > tours.length)
	if(!tour){
		return res.status(404).json({
			status:"fail",
			message:"Invalid ID"
		})
	}
	
	res.status(200).json({
		status:'sucess',
		result: tours.length,
		data:{
			tour
		}
	})*/
// }


exports.createTour = factory.createOne(Tour)


/*OLD WAY BEFORE USING HANDLER FACTORY CONTROLLER*/

// exports.createTour = catchAsync(async (req,res,next)=>{
// 	//OLD WAY OF SAVING TO MONGO DB
// 	/*const newTours = new Tour({})
// 	newTours.save()*/

// 	// try{
// 		 const newTours = await Tour.create(req.body)

// 		res.status(201).json({
// 	 		status:'sucess',
// 	 		data:{
// 	 			tours:newTours
// 	 		}
// 	 	})
	/*}catch(err){
		res.status(400).json({
			status:'failed',
			//message:err*
			message:err
		})*/
	//})

	



	 /*const newId = tours[tours.length - 1].id + 1
	 const newTours = Object.assign({id:newId}, req.body)
	 tours.push(newTours)

	 fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`,JSON.stringify(tours),err=>{
	 	res.status(201).json({
	 		status:'sucess',
	 		data:{
	 			tours:newTours
	 		}
	 	})
	 })*/
// }

exports.updateTour = factory.updateOne(Tour)

/*
//Old Way before factory method
exports.updateTour = catchAsync(async (req,res,next)=>{
	// try{
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new:true,
			runValidators:true
		})	


	if(!tour){
		return next(new AppError('No tour found with that ID',404))
	}
		res.status(200).json({
			status:'success',
			data:{
				tour
			}
		})*/

	/*}catch(err){
		res.status(404).json({
			status:'failed',
			message:err
		})
	}*/

//})






exports.deleteTour = factory.deleteOne(Tour)


// DELETING TOUR\
/*exports.deleteTour = catchAsync(async (req,res,next)=>{
	// try{


			const tour = await Tour.findByIdAndDelete(req.params.id)	


	if(!tour){
		return next(new AppError('No tour found with that ID',404))
	}
			res.status(204).json({
			status:'success',
			data: null
		})
	*//*}catch(err){
		res.status(404).json({
			status:'failed',
			message:err
		})
	}*/
	
//})


exports.getTourStats = catchAsync(async (req,res,next)=>{
	// try{

		const stats = await Tour.aggregate([
			{
				$match:{ratingsAverage: {$gte:4.5}}
			},
			{
				$group: {
					_id: '$difficulty',
					numTours: {$sum: 1},
					numRating: {$sum: '$ratingsQuantity'},
					avgRating: {$avg: '$ratingsAverage'},
					avgPrice: {$avg: '$price'},
					minPrice: {$min: '$price'},
					maxPrice: {$max: '$price'}
				}
			}

			])

		res.status(200).json({
			status:'sucess',
			length:stats.length,
			data:{
				stats
			}

		})
/*
	}catch(err){
		res.status(404).json({
			status:'Fail',
			message:err
		})
	}*/
})


exports.getMonthPlan = catchAsync(async (req,res,next)=>{
	// try{
		const year = req.params.year * 1

		const plan = await Tour.aggregate([
			{
				$unwind : '$startDates'
			},
			{
				$match:{
					startDates:{
						$gte: new Date(`${year}-01-01`),
						$lte: new Date(`${year}-12-31`)
					}
				}
			},
			{
				$group:{
					_id:{$month:'$startDates'},
					numToursStart:{$sum: 1 },
					tours:{$push:'$name'}
				}
			},
			{
				$addFields:{month:'$_id'}
			},
			{
				$project:{ _id: 0 }
			},
			{
				$sort:{
					numToursStart: -1
				}
			}

			])

		res.status(200).json({
			status:'sucess',
			lenth: plan.length,
			data:{
				plan
			}
		})

	/*}catch(error){
		res.status(404).json({
			status:'Fail',
			message:err
		})
	}*/
})


exports.getToursWithin = catchAsync( async (req,res,next)=>{
	const {distance, latlng, unit} = req.params
	const [lat, lng] = latlng.split(',')

	if(!lat || !lng){
		next( new AppError('Please provide latitude and longitude in the right format lat, lng', 400))
	}

	// console.log(distance, lat, lng, unit)

	const radius = unit === 'mi'? distance / 3963.2 : distance / 6378.1

	const tours = await Tour.find({
		startLocation: {$geoWithin: {$centerSphere: [[lng,lat], radius]}}
	})

	res.status(200).json({
		status:'success',
		results: tours.length,
		data:{
			data: tours
		}
	})
})


exports.getDistances = catchAsync( async (req,res,next)=>{
	const {latlng, unit} = req.params
	const [lat, lng] = latlng.split(',')

	const multiplier = unit === 'mi' ? 0.000621371 : 0.001

	if(!lat || !lng){
		next( new AppError('Please provide latitude and longitude in the right format lat, lng', 400))
	}

	const distances = await Tour.aggregate([
		{
			$geoNear:{
				near:{
					type: 'Point',
					coordinates: [lng * 1, lat * 1]
				},
				distanceField: 'distance',
				distanceMultiplie: multiplier
			}
		},
			{
				$project:{
					distance: 1,
					name: 1
				}
			}	
					
	])
	

	res.status(200).json({
		status:'success',
		data:{
			data: distances
		}
	})

})