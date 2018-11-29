const fs = require('fs')
const request = require('supertest')
const app = require('./app')

afterAll(() => {
  fs.writeFile('todos.json', JSON.stringify({ "nextKey": 2, "todos": [
    {"text": "Delete this item", "time24": "", "date": "2018-11-15", "done": "true", "key": 0},
    {"text": "Add more to my list", "time24": "", "date": "2018-11-15", "done":"false", "key": 1}
  ]}, null, 2))
})

describe('GET /todos', function() {
  it('respond with json', function (done) {
    request(app)
      .get('/todos')
      .expect(200, done)
  })
})

describe('POST /todos', function() {
  it('post with json', function (done) {
    request(app)
      .post('/todos')
      .expect(201, done)
  })
})