# Simple Product API

This API serves the data to the Simple Product App, providing store and product information to the Simple Product App.

## Summary

After setting up your postgres database and seeding the store data, you can retrieve the information, and render it on the Simple Product App

## Endpoints

### Store

`GET /api/store` Will retrieve the store data

`PATCH /api/store/:store_id` will update store with `id=store_id`

### Products

`GET /api/products` will retrieve all store products

`GET /api/products/:product_id` will retrieve a single product with `id=product_id`

`POST /api/products` will create a new product

`PATCH /api/products/:product_id` will update product with `id=product_id`

`DELETE /api/products/:product_id` will delete product with `id=product_id`
