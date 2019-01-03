const fs = require('fs');
const request = require('supertest');
const querystring = require('querystring');
const app = require('./app');
const { Client } = require('pg');
const DB = require('./db');
let db;
let client;

beforeAll(() => {
  client = new Client({
    user: 'postgres',
    password: 'pass',
    database: 'todos_test'
  });
  client.connect();
  db = DB(client);
});

afterAll(() => {
  client.end();
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

describe('GET all /todos', () => {
  it('should return all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200, done);
  });
});

describe('GET one /todos', () => {
  it('should return first todo', (done) => {
    request(app)
      .get('/todos/0')
      .expect(200, done);
  });
});

describe('GET INVALID /todos', () => {
  it('should 404 because invalid entry', (done) => {
    request(app)
      .get('/todos/343434343434')
      .expect(404, done);
  });
});

describe('POST to /todos', () => {
  it('should post a todo entry', (done) => {
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

describe('PUT to /todos', () => {
  it('should edit first todo entry', (done) => {
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

describe('PUT INVALID /todos', () => {
  it('should 404 because invalid entry', (done) => {
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

describe('DELETE one /todo', () => {
  it('should delete second todo entry', (done) => {
    request(app)
      .delete('/todos/1')
      .expect(204, done);
  });
});

describe('DELETE all /todos', () => {
  it('should delete all todos', (done) => {
    request(app)
      .delete('/todos')
      .expect(204, done);
  });
});

describe('DELETE INVALID /todo', () => {
  it('should 404 because invalid entry', (done) => {
    request(app)
      .delete('/todos/16161616161616')
      .expect(404, done);
  });
});

describe('EXPECT 404', () => {
  it('should 404', (done) => {
    request(app)
      .get('/nothing')
      .expect(404, done);
  });
});

describe('DB', () => {
  describe('getTodo()', () => {
    it('should return test todo', (done) => {
      db.getTodo(1, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBeGreaterThan(0);
        expect(res).toHaveLength(1);
        done();
      });
    });
  });
  describe('createTodo()', () => {
    it('should create test todo', (done) => {
      db.createTodo("new test todo", (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBeGreaterThan(0);
        expect(res[0].title).toBe("new test todo");
        done();
      });
    });
  });
  describe('updateTodo()', () => {
    it('should update first todo', (done) => {
      db.updateTodo(1, "updated todo", (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBeGreaterThan(0);
        expect(res[0].title).toBe("updated todo");
        done();
      });
    });
  });
  describe('getAll()', () => {
    it('should return all test todos', (done) => {
      db.getAll((err, res) => {
        if (err) throw err;
        expect(res[0].id).toBeGreaterThan(0);
        expect(res).toHaveLength(2);
        done();
      });
    });
  });
  describe('deleteTodo()', () => {
    it('should delete second todo', (done) => {
      db.deleteTodo(2, (err) => {
        if (err) throw err;
        done();
      });
    });
  });
  describe('deleteAll()', () => {
    it('should delete all todos', (done) => {
      db.deleteAll((err) => {
        if (err) throw err;
        done();
      });
    });
  });
});
