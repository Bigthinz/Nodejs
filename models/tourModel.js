const mongoose = require('mongoose')
const slugify = require('slugify') 
const validator = require("validator")
// const User = require('./userModel')

const tourSchema = new mongoose.Schema({
	name:{
		type:String,
		required:[true, 'A name is required in this field'],
		unique:true,
		trim:true,
		maxlength:[40,"A tour must have less or equal than 40"],
		minlength:[10,"A tour must have more or equal than 10"]
		//USING A PACKAGE CALLED VALIDATOR TO VALIDATE NAME INPUTS
		// validate:[validator.isAlpha, "The tour must only contain characters"]
	},
	slug:String,
	duration:{
		type:Number,
		required:[true, "A tour must have a duration"]
	},
	maxGroupSize:{
		type:Number,
		required:[true, "A tour must have a max group size"]
	},
	
	difficulty:{
		type:String,
		required:[true, "A tour must have a difficulty"],
		enum:{
			values:["easy","medium","difficult"],
			message:"Difficulty must be: easy or medium or difficult"
		}
	},
	ratingsAverage:{
		type:Number,
		default: 4.5,
		min:[1,"The rating value must be above 1.0"],
		max:[5, "The rating value must be below 5.0"],
		set: val => Math.round(val * 10)/ 10
	},
	ratingsQuantity:{
		type:Number,
		default: 0

	},
	price:{
		type:Number,
		required:[true, 'A tour must have a price']
	},
	priceDiscount:{
		type:Number,
		validate:{
			validator: function(val){
				//THIS ONLY WORKING ON CREATING A NEW DOCUMENT OR ENTRY
				return val < this.price
			},
			message:"Price Discount ({VALUE}) should be below regular price"	
		}
	},
	summary:{
		type:String,
		trim:true,
		required:[true, 'A summary is required']
	},
	description:{
		type:String,
		trim:true
	},
	imageCover:{
		type:String,
		required:[true, 'A tour must have an imageCover']
	},
	images:[String],
	createdAt:{
		type:Date,
		default: Date.now(),
		select:false
	},
	startDates:[Date],
	secretTour:{
		type:Boolean,
		default:false
	},
	startLocation:{
		type:{
			type:String,
			default: 'Point',
			enum:['Point']
		},
		coordinates:[Number],
		address:String,
		description:String
	},
	locations:[
		{
			type:{
				type:String,
				default: 'Point',
				enum: ['Point']
			},
			coordinates: [Number],
			address:String,
			description:String,
			day:Number
		}
	],
	// guides:Array
	guides:[
		{
			type:mongoose.Schema.ObjectId,
			ref: 'User'
		}
	]
},
{
	toJSON:{virtuals:true},
	toObject:{virtuals:true}
})

//index() helps to improve the query performance of the application
//value one stands for acesding order and -1 for decendening
tourSchema.index({price: 1, ratingsAverage: -1})
tourSchema.index({slug:1})
//in other to perform goespatial query we need to index with 2dsphere 
tourSchema.index({startLocation: '2dsphere'})


tourSchema.virtual('durationWeeks').get(function(){
	return this.duration / 7
})

// virtual populate reviews on tour model
tourSchema.virtual('reviews', {
	ref:'Review',
	foreignField:'tour',
	localField:'_id'
})

//DOCUMENT MIDDLEWARE runs before SAVE() and CREATE()
tourSchema.pre('save',function(next){
	this.slug = slugify(this.name,{lower:true})
	next()
})

//saving and EMBEDDING USERS IN TOURS MODEL schema....
/*tourSchema.pre('save',async function(){
	const guidePromises = this.guides.map(async id => await User.findById(id))
	this.guides = await Promise.all(guidePromises)
})
*/



//--------elabratind on document middleware
/*
//runs before document is been saved
tourSchema.pre('save',function(next){
	console.log('will save document')
	next()
})


//runs after document is been saved
tourSchema.post('save',function(doc,next){
	console.log(doc)
	next()
})
*/

tourSchema.pre(/^find/,function(next){
	this.find({secretTour:{$ne:true}})
	next()
})

tourSchema.pre(/^find/, function(next){
	this.populate({
		path:'guides',
		select: '-__v -passwordChangedAt'
	})

	next()
})

// tourSchema.pre('aggregate', function(next){
// 	this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
// 	next()
// })


const Tour = mongoose.model('Tour',tourSchema)

module.exports = Tour
