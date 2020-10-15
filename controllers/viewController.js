const Tour = require('./../models/tourModel')
const catchAsync = require('./../utils/catchAsync')


exports.getOverview = catchAsync(async(req, res, next) => {
    const tours = await Tour.find()
    res.status(200).render('overview', {
        title: 'All tour',
        tours
    })
})



exports.getTour = catchAsync(async(req, res, next) => {
    // DET THE DATA FOR THE REQUESTED TOUR (including reviews and guides)
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'user rating review'
    })

    //build template

    //rendering data from 1)
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour

    })
})


exports.login = catchAsync(async(req, res) => {

    res.status(200).render('login', {
        title: 'Log into your account'
    })
})