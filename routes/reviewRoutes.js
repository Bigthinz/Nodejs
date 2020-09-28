const express = require('express')
const reviewController = require('./../controllers/reviewController')
const {protect, restrictTo} = require('./../controllers/authController')

// mergeParams in express router serves both route of reviews(api/v1/reviews) and tour-Reviews(api/v1/tours/65436/reviews)coming from tours model
const router = express.Router({mergeParams: true})

//this middleware automatically protects all routes that comes after it NOTE!!...because middleware runs in sequence
router.use(protect)

router.route('/')
	  .get(reviewController.getAllReviews)
	  .post(restrictTo('user'),reviewController.setTourUserIds, reviewController.createReview)


router.route('/:id')
	  .get(reviewController.getReview)
	  .delete(restrictTo('user', 'admin'),reviewController.deleteReview)
	  .patch(restrictTo('user', 'admin'),reviewController.updateReview)


module.exports = router
