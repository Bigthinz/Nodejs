const mongoose = require('mongoose')
const dotenv = require('dotenv')


process.on('uncaughtException', err=>{
	console.log('UNCAUGHT EXCEPTION. Server is shutting down....')
	console.log(err.name, err.message)

	process.exit(1)
})


dotenv.config({path:'./config.env'})
const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useFindAndModify:false,
	useUnifiedTopology: true 
}).then(con =>{
	// console.log(con.connections)
	console.log("database connected")
})




/*
//CONNECTING TO LOCAL DATABASE

mongoose.connect(process.env.DATABASE_LOCAL,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useFindAndModify:false
}).then(con =>{
	console.log(con.connections)
	console.log("database connected")
})

*/


const PORT = process.env.PORT || 3000

const server = app.listen(PORT,()=>{
	console.log('app server is running........')
})


process.on('unhandledRejection',err =>{
	console.log('UNHANDLED REJECTION.  Server shutting down....')
	console.log(err.name, err.message)

	server.close(()=>{
		process.exit(1) //Zero "0" for server 0k AND One '1' for erors or crashed
	})
})

	