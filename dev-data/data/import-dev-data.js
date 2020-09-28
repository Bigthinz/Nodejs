const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('./../../models/tourModel')
const Review = require('./../../models/reviewModel')
const User = require('./../../models/userModel')

dotenv.config({path:`${__dirname}./../../config.env`})



const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology: true,
	useFindAndModify:false
}).then(con =>{
	// console.log(con.connections)
	console.log("database connected")
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'))
			


//IMPORTING DATA INTO DB
const importData = async ()=>{
	try{
		
	await Tour.create(tours)
	await User.create(users, {validateBeforeSave:false})
	await Review.create(reviews)
	console.log('Data created sucessfully')

	}catch(err){
		console.log(err)
	}
	process.exit() 
}



//DELETING DATA FROM THE DB
const deleteData = async ()=>{
	try{
		await Tour.deleteMany()
		await User.deleteMany()
		await Review.deleteMany()
		console.log('Data deleted sucessfully')
	}catch(err){
		console.log(err)
	}
	process.exit()
}

if(process.argv[2] === '--import'){
	importData()
}else if(process.argv[2] === '--deleted'){
	deleteData()
}

console.log(process.argv)
