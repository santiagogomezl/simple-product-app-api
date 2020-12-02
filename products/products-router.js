const express = require('express')
const xss = require('xss')
const multer = require('multer')
const ProductsService = require('./products-service')
const { render } = require('../src/app')

const productsRouter = express.Router()
const jsonParser = express.json()

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public' )
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${file.originalname}-${uniqueSuffix}`)
  }
})

const upload = multer({ storage: storage }).any()

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

// Endpoints to GET products
productsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ProductsService.getAllProducts(knexInstance)
      .then(products => {

        const parsedProducts = products.map(product => {
          let features = product.features
          features = typeof(features) === 'string' ? JSON.parse(features) : features
          return(
            {
              id: product.id,
              name: product.name,
              details: product.details,
              price: product.price,
              logo: product.logo,
              features: features,
              images: product.images
            }
          )
        })

        res.json(parsedProducts.map(serializeProduct))
      })
      .catch(next)
  })
  .post( upload, (req, res, next) => {

    const { id, name, price, features, details } = req.body
    let { logo, images } = req.body

    if(!logo){
      logo = req.files.find(file => file.fieldname === 'logo')
      logo = logo.filename
    }

    if(!images){
      images = req.files.filter(file => file.fieldname === 'images')
      images = images.map(image => { return image.filename })
    }else{
      images = JSON.parse(images)
    }
 
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
    .then( product => {
        let features = product.features
        features = typeof(features) === 'string' ? JSON.parse(features) : features
        const parsedProduct =
          {
            id: req.params.product_id,
            name: product.name,
            details: product.details,
            price: product.price,
            logo: product.logo,
            features: features,
            images: product.images
          }
        res.json(serializeProduct(parsedProduct)).status(201)
      })
      .catch(next)

  })   

  productsRouter
  .route('/:product_id')
  .all(jsonParser, (req, res, next) => {
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
        
        let { features } = product
        features = typeof(features) === 'string' ? JSON.parse(features) : features
        
        res.product = {
          id: product.id,
          name: product.name,
          details: product.details,
          price: product.price,
          logo: product.logo,
          features: features,
          images: product.images
        }
        
        next()
      })
      .catch(next)
  })
  .get( (req, res, next) => {
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
  .patch( upload, (req, res, next) => {

    const { id, name, price, features, details } = req.body
    let { logo, images } = req.body

    if(!logo){
      logo = req.files.find(file => file.fieldname === 'logo')
      logo = logo.filename
    }

    if(!images){
      images = req.files.filter(file => file.fieldname === 'images')
      images = images.map(image => { return image.filename })
    }else{
      images = JSON.parse(images)
    }
 
    const product = { name, price, features, details, logo, images }
    const numberOfValues = Object.values(product).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'name', 'details',  or 'price'`
        }
      })
    }

    ProductsService.updateProduct(
      req.app.get('db'),
      req.params.product_id,
      product
      )
      .then(() => {
          let features = product.features
          features = typeof(features) === 'string' ? JSON.parse(features) : features
          const parsedProduct =
            {
              id: req.params.product_id,
              name: product.name,
              details: product.details,
              price: product.price,
              logo: product.logo,
              features: features,
              images: product.images
            }
        res.json(serializeProduct(parsedProduct)).status(204).end()
      })
      .catch(next)
    })
  
module.exports = productsRouter