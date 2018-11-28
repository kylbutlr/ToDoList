const request = require('supertest')
const app = require('./app')

describe('GET /todos', function() {
  it('respond with json', function (done) {
    request(app)
      .get('/todos')
      .expect(200, done)
  })
})

describe('POST /todos', function() {
  it('respond with json', function (done) {
    request(app)
      .post('/todos')
      .expect(201, done)
  })
})