const app = require('./app')

describe('GET /todos', function() {
  it('respond with json', function (done) {
    request(app)
      .get('/todos')
      .expect(200, done)
  })
})