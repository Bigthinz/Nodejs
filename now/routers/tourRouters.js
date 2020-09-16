const express = require('express')

const {getAllTours,getTour,createTour,checkID} = require(`${__dirname}/../controls/tourControl`)

router = express.Router()
router.param('id',checkID)

router.route('/')
	  .get(getAllTours)
	  .post(createTour)

router.route('/:id')
	  .get(getTour)



module.exports = router

