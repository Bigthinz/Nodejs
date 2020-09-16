const express = require('express')
const morgan = require('morgan')
const app = express()

const globalErrorHandler = require('./controllers/errorController')
const appError = require('./utils/appError')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.json())

app.use(express.static(`${__dirname}/public`))

//check requestTime
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()

    //to display headers of url
    // console.log(req.headers)
    next()
})


app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)


//HANDLING ALL ROUTE ERRORS IN CASE OF IMPUT URL MISTAKES
app.all('*', (req, res, next) => {

    //FIRST METHOD........INITIAL
    /* res.status(404).json({
        status:'fail',
        message:`Cant find ${req.originalUrl} on the server`
    })*/


    //SECOND METHOD USING THE ERROR HANDLING MIDDLEWARE
    /* const err = new Error(`Cant find ${req.originalUrl} on the server`)
     err.statusCode = 404
     err.status = 'Fail'

     next(err)
     */

    next(new appError(`Cant find ${req.originalUrl} on the server`, 404))

})

// INITAIL CALLING ERROR HANDLER

/*app.use((err,req,res,next)=>{
   
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

   res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message
   })
})*/

//REFACRORED CALLING ERROR HANDLER

app.use(globalErrorHandler)

module.exports = app


// app.get('/',(req,res)=>{
// 	res.status(200).json({message:'hello from the server side', list:'well listen'})
// })


// app.post('/', (req,res)=>{
// 	res.send('you can post to this url')
// })


// app.get('/api/v1/tours',getAllTours)
// app.get('/api/v1/tours/:id',getTour)
// app.post('/api/v1/tours',createTour)

/////////////// INITIAL WAY OF ROUTING

/*
app.route('/api/v1/tours')
	.get(getAllTours)
	.post(createTour)

app.route('/api/v1/tours/:id')
   .get(getTour)
   .patch(updateTour)
   .delete(deleteTour)


app.route('/api/v1/users')
   .get(getAllUsers)
   .post(createUser)

app.route('/api/v1/users/:id')
   .get(getUser)
   .patch(updateUser)
   .delete(deleteUser)

*/

///// MOUNTING WAY OF ROUTING USING MIDDLEWARE