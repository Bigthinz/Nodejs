const fs = require('fs')
const express = require('express')
const morgan = require('morgan')

const tourRouters = require('./routers/tourRouters')
const app = express()


app.use(express.json())
app.use(morgan('dev'))


app.use('/api/v1/tours',tourRouters)


module.exports = app

