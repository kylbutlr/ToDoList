const fs = require('fs');
const request = require('supertest');
const querystring = require('querystring');
const app = require('./app');
const { Client } = require('pg');
const DB = require('./db');
let db;

beforeAll(() => {
  const client = new Client({
    database: 'todos_test'
  });
  client.connect();
  db = DB(client);
});

afterAll(() => {
  fs.writeFile('todos.json', JSON.stringify(
    { 
      nextKey: 2, 
      todos: [
        {
          text: "Delete this item", 
          time24: "", 
          date: "2018-01-01", 
          done: "true", 
          key: 0
        },
        {
          text: "Add more to my list", 
          time24: "", 
          date: "2018-01-01", 
          done:"false", 
          key: 1
        }
  ]}, null, 2));
});

describe('GET all /todos', function() {
  it('should return all todos', function (done) {
    request(app)
      .get('/todos')
      .expect(200, done);
  });
});

describe('GET one /todos', function() {
  it('should return first todo', function (done) {
    request(app)
      .get('/todos/0')
      .expect(200, done);
  });
});

describe('GET INVALID /todos', function() {
  it('should 404 because invalid entry', function (done) {
    request(app)
      .get('/todos/343434343434')
      .expect(404, done);
  });
});

describe('POST to /todos', function() {
  it('should post a todo entry', function (done) {
    const todo = querystring.stringify({
      "text": "NEW ENTRY",
      "time24": "",
      "date": "",
      "done": "false"
    });
    request(app)
      .post('/todos')
      .send(todo)
      .expect(201, done);
  });
});

describe('PUT to /todos', function() {
  it('should edit first todo entry', function (done) {
    const todo = {
      "text": "EDITED ENTRY",
      "time24": "",
      "date": "",
      "done": "false",
      "key": 0
    };
    request(app)
      .put('/todos')
      .send(todo)
      .expect(204, done);
  });
});

describe('PUT INVALID /todos', function() {
  it('should 404 because invalid entry', function (done) {
    const todo = {
      "text": "INVALID ENTRY",
      "time24": "",
      "date": "",
      "done": "false",
      "key": 2525252525
    };
    request(app)
      .put('/todos')
      .send(todo)
      .expect(404, done);
  });
});

describe('DELETE one /todo', function() {
  it('should delete second todo entry', function (done) {
    request(app)
      .delete('/todos/1')
      .expect(204, done);
  });
});

describe('DELETE all /todos', function() {
  it('should delete all todos', function (done) {
    request(app)
      .delete('/todos')
      .expect(204, done);
  });
});

describe('DELETE INVALID /todo', function() {
  it('should 404 because invalid entry', function (done) {
    request(app)
      .delete('/todos/16161616161616')
      .expect(404, done);
  });
});

describe('404', function() {
  it('should 404', function (done) {
    request(app)
      .get('/nothing')
      .expect(404, done);
  });
});

describe('db', () => {
  describe('getTodo()', () => {
    it('should return test record', (done) => {
      db.getTodo(1, (err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(1);
        done();
      });
    });
  });
});
