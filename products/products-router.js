const path = require('path')
const express = require('express')
const xss = require('xss')
const ProductsService = require('./products-service')

const productsRouter = express.Router()

const serializeProduct = product => ({
    id: product.id,
    name: xss(product.name),
    price: product.price,
    logo: xss(product.logo),
    weight: product.weight,
    lenght: product.lenght,
    diameter: product.weight,
    images: product.images,
    details: xss(product.details)
})

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
  
module.exports = productsRouter