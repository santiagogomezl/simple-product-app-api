require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const productsRouter = require('../products/products-router.js')
const storeRouter = require('../store/store-router.js')


const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())

//middleware to serve public assets i.e images
app.use('/public', express.static('public'))


// Validate API TOKEN
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {  
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

//Endpoints to access store data
app.use('/api/store', storeRouter)
app.use('/api/products', productsRouter)

app.get('/', (req, res) => {
  res
    .send('Hello Express!')
})

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: 'Server error' }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app
