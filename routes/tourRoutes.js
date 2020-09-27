const express = require('express')

//REQUIRING ROUTES RESPONDS FROM CONTROLLER FOLDER "tourController.js"
const  tourController = require('./../controllers/tourController')
const {protect, restrictTo} = require('./../controllers/authController')
// const reviewController = require('./../controllers/reviewController')
const reviewRouter = require('./../routes/reviewRoutes')

//MIDDLEWARE
router = express.Router()

router.use('/:tourId/reviews', reviewRouter)

//check id PARAMS
/*router.param('id',checkID)*/


//ROUTES WITH REFERENCE FROM CONTROLLERS FOLDER "tourController"

router.route('/tour-stats').get(tourController.getTourStats)

router.route('/top-5-cheap')
			.get(tourController.aliasTopTours, tourController.getAllTours)

router.route('/monthly-plan/:year')
	  .get(tourController.getMonthPlan)

router.route('/')
	.get(protect,tourController.getAllTours)
	.post(tourController.createTour)

router.route('/:id')
   .get(tourController.getTour)
   .patch(tourController.updateTour)
   .delete(protect,restrictTo('admin','lead-guide'), tourController.deleteTour)

/*
router.route('/:tourId/reviews')
	  .post(protect, restrictTo('user'), reviewController.createReview)
*/


module.exports = router