const request = require('supertest');
const { Client } = require('pg');
const App = require('./app');
const DB = require('./db');
let db;
let client;

beforeAll(() => {
  client = new Client({
    user: 'xwjbpnahjviqxd',
    password: '2d893d7efc3e04435a11903f927687f998070964e5e4882fdd05dc300eb8a3ef',
    database: 'dai0irse5nbbgl',
    port: 5432,
    host: 'ec2-23-23-173-30.compute-1.amazonaws.com',
    ssl: true,
  });
  client.connect();
  db = DB(client);
  app = App(client);
});

afterAll(() => {
  client.end();
});

describe('CLIENT', () => {
  describe('POST to /todos', () => {
    it('should post a todo entry', done => {
      const title = 'NEW ENTRY';
      const date = null;
      const time = null;
      const complete = false;
      request(app)
        .post('/todos')
        .send({ title, date, time, complete })
        .expect(201, done);
    });
  });
  describe('GET all /todos', () => {
    it('should return all todos', done => {
      request(app)
        .get('/todos')
        .expect(200, done);
    });
  });
  describe('GET one /todos', () => {
    it('should return first todo', done => {
      request(app)
        .get('/todos/1')
        .expect(200, done);
    });
  });
  describe('GET invalid /todos', () => {
    it('should 404 because invalid entry', done => {
      request(app)
        .get('/todos/-1')
        .expect(404, done);
    });
  });
  describe('PUT to /todos', () => {
    it('should edit first todo entry', done => {
      const title = 'EDITED ENTRY';
      const date = null;
      const time = null;
      const complete = false;
      request(app)
        .put('/todos/1')
        .send({ title, date, time, complete })
        .expect(204, done);
    });
  });
  describe('PUT invalid /todos', () => {
    it('should 404 because invalid entry', done => {
      const title = 'INVALID ENTRY';
      const date = null;
      const time = null;
      const complete = false;
      request(app)
        .put('/todos/-1')
        .send({ title, date, time, complete })
        .expect(404, done);
    });
  });
  describe('DELETE one /todo', () => {
    it('should delete second todo entry', done => {
      request(app)
        .delete('/todos/1')
        .expect(204, done);
    });
  });
  describe('DELETE all /todos', () => {
    it('should delete all todos', done => {
      request(app)
        .delete('/todos')
        .expect(204, done);
    });
  });
  describe('DELETE invalid /todo', () => {
    it('should 404 because invalid entry', done => {
      request(app)
        .delete('/todos/161616')
        .expect(404, done);
    });
  });
});

describe('DB', () => {
  describe('getAll()', () => {
    it('should return all entries, should be none', done => {
      db.getAll((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(0);
        done();
      });
    });
  });
  describe('createTodo()', () => {
    it('should create test todo', done => {
      db.createTodo('first test todo', null, null, false, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(3);
        expect(res[0].title).toBe('first test todo');
        done();
      });
    });
  });
  describe('createTodo()', () => {
    it('should create second test todo', done => {
      db.createTodo('second test todo', null, null, false, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(4);
        expect(res[0].title).toBe('second test todo');
        done();
      });
    });
  });
  describe('getTodo()', () => {
    it('should return first test todo', done => {
      db.getTodo(3, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(3);
        expect(res).toHaveLength(1);
        expect(res[0].title).toBe('first test todo');
        done();
      });
    });
  });
  describe('updateTodo()', () => {
    it('should update first test todo', done => {
      db.updateTodo(3, 'updated test todo', null, null, false, (err, res) => {
        if (err) throw err;
        expect(res[0].id).toBe(3);
        expect(res[0].title).toBe('updated test todo');
        done();
      });
    });
  });
  describe('getAll()', () => {
    it('should return all test todos', done => {
      db.getAll((err, res) => {
        if (err) throw err;
        expect(res[0].id).toBeGreaterThan(0);
        expect(res).toHaveLength(2);
        done();
      });
    });
  });
  describe('deleteTodo()', () => {
    it('should delete second todo', done => {
      db.deleteTodo(3, done);
    });
  });
  describe('getAll()', () => {
    it('should return all entries, should be one', done => {
      db.getAll((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(1);
        done();
      });
    });
  });
  describe('deleteAll()', () => {
    it('should delete all todos', done => {
      db.deleteAll(done);
    });
  });
  describe('getAll()', () => {
    it('should return all entries, should be none', done => {
      db.getAll((err, res) => {
        if (err) throw err;
        expect(res).toHaveLength(0);
        done();
      });
    });
  });
});

describe('404', () => {
  it('should 404', done => {
    request(app)
      .get('/nothing')
      .expect(404, done);
  });
});
