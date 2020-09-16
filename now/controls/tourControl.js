const fs = require('fs')


const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`,'utf-8'))






exports.checkID = (req,res,next,val)=>{
	if(req.params.id * 1 > tours.length){
		res.status(404).json({  
			status: 'fail to delete',
			message: 'Invalid ID'
		})
	}
	next()
}


exports.getAllTours = (req,res)=>{
	res.status(200).json({
		status:"success",
		length: tours.length,
		data:{
			tours
		}
	})
}

exports.getTour = (req,res)=>{
const id = req.params.id * 1
const tour = tours.find(el => el.id === id)

res.status(200).json({
	status:'success',
	data:{
		tour
		}
	})
}



exports.createTour = (req,res)=>{
	const newID = tours[tours.length - 1].id + 1
	const newTours = Object.assign({id:newID}, req.body)
	console.log(newTours)
	
}