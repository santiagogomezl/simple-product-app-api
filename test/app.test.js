require('./setup')

const knex = require('knex')

const { DATABASE_URL } = require('../src/config')

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
})

const app = require('../src/app')

app.set('db', db)

const store = [
  {
      id: 1,
      name:'Barone',
      logo:'logo-one.jpg',
      weight:45,
      lenght: 7,
      diameter:2,
      images: [
          'image-one-one.jpg',
          'image-one-two.jpg',
          'image-one-three.jpg',
          'image-one-four.jpg'
      ],
      details: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. ',
      price: 150,
  },
  {
      id: 2,
      name:'Bartwo',
      logo:'logo-two.jpg',
      weight:35,
      lenght: 7,
      diameter:2,
      images: [
          'image-two-one.jpg',
          'image-two-two.jpg',
          'image-two-three.jpg',
          'image-two-four.jpg'
      ],
      details: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. ',
      price: 120,
  },
  {
      id: 3,
      name:'Barthree',
      logo:'logo-three.jpg',
      weight:35,
      lenght: 5,
      diameter:2,
      images: [
          'image-three-one.jpg',
          'image-three-two.jpg',
          'image-three-three.jpg',
          'image-three-four.jpg'
      ],
      details: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. ',
      price: 120,
  },
  {
      id: 4,
      name:'Barfour',
      logo:'logo-four.jpg',
      weight:45,
      lenght: 7,
      diameter:2,
      images: [
          'image-four-one.jpg',
          'image-four-two.jpg',
          'image-four-three.jpg',
          'image-four-four.jpg'
      ],
      details: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. ',
      price: 180,
  },
]

describe('Express App', () => {
  it('should return a message from GET /', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello Express!')
  })
})


describe('Simple Product API', () => {
  it('GET /api/products responds with 200 containing database with products', () => {
    return supertest(app)
      .get('/api/products')
      .expect(200, store)
  })

  it('GET /api/products/:product_id responds with 200 containing one single product', () => {
    return supertest(app)
      .get('/api/products/1')
      .expect(200, store[0])
  })

})

