//const path = require('path')
const express = require('express')
const xss = require('xss')
const ProductsService = require('./products-service')

const productsRouter = express.Router()
const jsonParser = express.json()

const serializeProduct = product => ({
    id: product.id,
    name: xss(product.name),
    price: Number(xss(product.price)),
    logo: xss(product.logo),
    images: product.images.map(image => xss(image)),
    details: xss(product.details),
    features: product.features.map(feature => {
      return {
        feature_id: feature.feature_id, 
        feature_value: xss(feature.feature_value)
      } 
    })
})

//Endpoints to GET products
productsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ProductsService.getAllProducts(knexInstance)
      .then(products => {
        res.json(products.map(serializeProduct))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, price, logo, features, images, details } = req.body
    const newProduct = { name, price, logo, features, images, details }

    for (const [key, value] of Object.entries(newProduct)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    ProductsService.insertProduct(
      req.app.get('db'),
      newProduct
    )
    .then(product => {
      res
        .status(201)
        .json(serializeProduct(product))
    })
    .catch(next)

  })   

  productsRouter
  .route('/:product_id')
  .all((req, res, next) => {
    ProductsService.getById(
      req.app.get('db'),
      req.params.product_id
    )
      .then(product => {
        if (!product) {
          return res.status(404).json({
            error: { message: `Product doesn't exist` }
          })
        }
        res.product = product
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeProduct(res.product))
  })
  .delete((req, res, next) => {
    ProductsService.deleteProduct(
      req.app.get('db'),
      req.params.product_id
    )
      .then(() => {
        res.json(res.product).status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, price, logo, features, images, details } = req.body
    const product = { name, price, logo, features, images, details }

    const numberOfValues = Object.values(product).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'name', 'last name' or 'email'`
        }
      })
    }

    ProductsService.updateProduct(
        req.app.get('db'),
        req.params.product_id,
        product
       )
         .then(() => {
           res.json(res.product).status(204).end()
         })
         .catch(next)
    })
  
module.exports = productsRouter