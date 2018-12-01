const fs = require('fs')
const request = require('supertest')
const querystring = require('querystring')
const app = require('./app')

/*afterAll(() => {
  fs.writeFile('todos.json', JSON.stringify({ "nextKey": 2, "todos": [
    {"text": "Delete this item", "time24": "", "date": "2018-11-15", "done": "true", "key": 0},
    {"text": "Add more to my list", "time24": "", "date": "2018-11-15", "done":"false", "key": 1}
  ]}, null, 2))
})*/

describe('GET all /todos', function() {
  it('should return all todos', function (done) {
    request(app)
      .get('/todos')
      .expect(200, done)
  })
})

describe('GET one /todos', function() {
  it('should return first todo', function (done) {
    request(app)
      .get('/todos/0')
      .expect(200, done)
  })
})

describe('POST to /todos', function() {
  it('should post a todo entry', function (done) {
    const todo = querystring.stringify({
      "text": "NEW ENTRY",
      "time24": "",
      "date": "2018-11-15",
      "done": "false"
    })
    request(app)
      .post('/todos')
      .send(todo)
      .expect(201, done)
  })
})

describe('PUT to /todos', function() {
  it('should edit first todo entry', function (done) {
    const todo = {
      "text": "EDITED ENTRY",
      "time24": "",
      "date": "2018-11-15",
      "done": "false",
      "key": 0
    }
    request(app)
      .put('/todos')
      .send(todo)
      .expect(204, done)
  })
})

describe('DELETE one /todos', function() {
  it('should delete second todo entry', function (done) {
    request(app)
      .delete('/todos/1')
      .expect(204, done)
  })
})

/*describe('DELETE all /todos', function() {
  it('should delete all todos', function (done) {
    request(app)
      .delete('/todos')
      .expect(204, done)
  })
})*/