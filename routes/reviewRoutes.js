const express = require('express')
const reviewController = require('./../controllers/reviewController')
const {protect, restrictTo} = require('./../controllers/authController')

// mergeParams in express router serves both route of reviews(api/v1/reviews) and tour-Reviews(api/v1/tours/65436/reviews)coming from tours model
const router = express.Router({mergeParams: true})

router.route('/')
	  .get(reviewController.getAllReviews)
	  .post(protect,restrictTo('user'),reviewController.setTourUserIds, reviewController.createReview)


router.route('/:id')
	  .delete(reviewController.deleteReview)
	  .patch(reviewController.updateReview)


module.exports = router
