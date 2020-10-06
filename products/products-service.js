const ProductsService = {
    getAllProducts(knexInstance) {
      return knexInstance.select('*').from('simpleproduct_products')
    },
  
  
    getById(knex, id) {
      return knex
        .from('simpleproduct_products')
        .select('*')
        .where('id', id)
        .first()
    },
  
  
  }
  
  module.exports = ProductsService