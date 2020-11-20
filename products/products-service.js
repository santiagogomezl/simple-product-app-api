const ProductsService = {

    //Use knew instance to build query to database
    getAllProducts(knexInstance) {
      return knexInstance
        .select('*')
        .from('simpleproduct_products')
        .orderBy('id', 'asc')
    },
  
    getById(knex, id) {
      return knex
        .from('simpleproduct_products')
        .select('*')
        .where('id', id)
        .first()
    },

    insertProduct(knex, product) {
      return knex
        .insert(
          {
            name: `${product.name}`,
            price: `${product.price}`,
            logo: `${product.logo}`,
            details: `${product.details}`,
            images: product.images,
            features: JSON.stringify(product.features)
          }
        )
        .into('simpleproduct_products')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    deleteProduct(knex, id) {
      return knex('simpleproduct_products')
        .where({ id })
        .delete()
    },

    updateProduct(knex, id, product){
      return knex('simpleproduct_products')
        .where({ id })
        .update(
          {
            name: `${product.name}`,
            price: `${product.price}`,
            logo: `${product.logo}`,
            details: `${product.details}`,
            images: product.images,
            features: JSON.stringify(product.features)
          }
        )
    },

  }
  
  module.exports = ProductsService