require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {CLIENT_ORIGIN} = require('./config');
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const productsRouter = require('../products/products-router.js')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {  
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
})

app.use('/api/products', productsRouter)

app.get('/', (req, res) => {
  res
    .send('Hello Express!');
});

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
