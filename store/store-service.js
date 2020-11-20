const StoreService = {

    //Use knew instance to build query to database
    getStoreData(knexInstance) {
      return knexInstance.select('*').from('simpleproduct_store')
    },
  
    getById(knex, id) {
      return knex
        .from('simpleproduct_store')
        .select('*')
        .where('id', id)
        .first()
    },
  
    updateStore(knex, id, store){
      return knex('simpleproduct_store')
        .where({ id })
        .update(
          {
            title: `${store.title}`,
            description: `${store.description}`,
            features: JSON.stringify(store.features)
          }
        )
    },

  }
  
  module.exports = StoreService