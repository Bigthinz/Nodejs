const mongoose = require('mongoose')
const Tour = require('./tourModel')


const reviewSchema = new mongoose.Schema({
	review:{
		type:String,
		required:[true, 'Review can not be empty']
	},
	rating:{
		type:Number,
		min: 1,
		max: 5

	},
	createdAt:{
		type:Date,
		default:Date.now()
	},
	tour:{
		type: mongoose.Schema.ObjectId,
		ref: 'Tour',
		required: [true, 'Review must belong to a tour']
	},
	user:{
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [true, 'Review must belong to a user']
	}

},
{
	toJSON:{virtuals:true},
	toObject:{virtuals:true}
})

//POPULATING TOURS AND USERS IN REVIEWS
reviewSchema.pre(/^find/, function(next){
	//POPULATE ALL FIELDS STATED
	/*this.populate({
		path: 'tour',
		select: 'name'
	}).populate({
		path:'user',
		select: 'name photo'
	})*/


	//POPULATING ONLY USERS IN REVIEW
	this.populate({
		path:'user',
		select: 'name photo'
	})

	next()
})


//Aggregating or calculating reviews to displays average reviews
reviewSchema.statics.calcAverageRatings = async function(tourId){
	const stats = await this.aggregate([
	{
		$match: {tour: tourId}
	},
	{
		$group: {
			_id: '$tour',
			nRating: {$sum: 1},
			avgRating: {$avg: '$rating'}
		}
	}

	])
console.log(stats)

	await Tour.findByIdAndUpdate(tourId,{
		ratingsQuantity: stats[0].nRating,
		ratingsAverage: stas[0].avgRating
	})

}


reviewSchema.post('save', function(){
	//this points to the current review
	this.constructor.calcAverageRatings(this.tour)
})


const Review = mongoose.model('Review', reviewSchema)

module.exports = Review