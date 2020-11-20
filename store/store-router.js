//const path = require('path')
const express = require('express')
const xss = require('xss')
const StoreService = require('./store-service')

const storeRouter = express.Router()
const jsonParser = express.json()

const serializeStore = store => ({
    id: store.id,
    storeTitle: xss(store.title),
    storeDescription: xss(store.description),
    storeFeatures: store.features.map(feature => {
      return {
        feature_id: feature.feature_id, 
        feature_name: xss(feature.feature_name),
        feature_fa_icon: xss(feature.feature_fa_icon),
      } 
    })
})

//Endpoints to GET products
storeRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    StoreService.getStoreData(knexInstance)
      .then(store => {
        res.json(serializeStore(store[0]))
      })
      .catch(next)
  })    

  storeRouter
  .route('/:store_id')
  .all((req, res, next) => {
    StoreService.getById(
      req.app.get('db'),
      req.params.store_id
    )
      .then(store => {
        if (!store) {
          return res.status(404).json({
            error: { message: `Store doesn't exist` }
          })
        }
        res.store = store
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeStore(res.store))
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, description, features } = req.body
    const store = { title, description, features }

  const numberOfValues = Object.values(store).filter(Boolean).length
   if (numberOfValues === 0) {
     return res.status(400).json({
       error: {
         message: `Request body must contain either 'title', 'description' or 'features'`
       }
     })
   }

    StoreService.updateStore(
    req.app.get('db'),
    req.params.store_id,
    store
    )
    .then(() => {
      res.json(res.store).status(204).end()
    })
    .catch(next)

  })
  
module.exports = storeRouter