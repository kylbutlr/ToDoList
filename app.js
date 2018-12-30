const fs = require('fs');
const querystring = require('querystring');
const express = require('express');
const cors = require('cors');
const app = express();
const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  password: 'pass',
  database: 'playground'
});
client.connect();
let todos;
let nextKey;

const db = {
  getAll: cb => client.query('SELECT * FROM todos', (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  getTodo: (id, cb) => client.query('SELECT * FROM todos WHERE id = $1', [id], (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  createTodo: (todo, cb) => client.query('INSERT INTO todos (title) VALUES ($1)', [id], (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  updateTodo: (id, cb) => client.query('UPDATE $1 FROM todos', (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  deleteAll: cb => client.query('DELETE * FROM todos', (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  deleteTodo: (id, cb) => client.query('DELETE $1 FROM todos', (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  })
};

const getAllTodos = (req,res) => {
  fs.readFile('todos.json', 'utf-8', (err,data) => {
    if (err) { throw err; }
    res.statusCode = 200;
    res.end(data);
  });
};

const getOneTodo = (req,res,next) => {
  const key = Number(req.params.id);
  fs.readFile('todos.json', 'utf-8', (err,data) => {
    if (err) { throw err; }
    parsedData = JSON.parse(data);
    if (!parsedData.todos[key]) {
      next();
    }
    res.statusCode = 200;
    res.end(JSON.stringify({ 
      todo: parsedData.todos.find(t => t.key === key)
    }));
  });
};

const postTodo = (req,res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    fs.readFile('todos.json', 'utf8', (err,data) => {
      if (err) { throw err; }
      const todosData = JSON.parse(data);
      const todo = querystring.parse(body);
      todo.key = nextKey;
      nextKey++;
      todosData.todos.push(todo);
      todos = todosData.todos;
      const newData = JSON.stringify({ 
        "nextKey": nextKey, 
        "todos": todosData.todos
      }, null, 2);
      fs.writeFile('todos.json', newData, (err) => {
        if (err) { throw err; }
        res.statusCode = 201;
        res.end('POST');
      });
    });
  });
};

const editTodo = (req,res,next) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    const parsedBody = JSON.parse(body);
    parsedBody.key = parseInt(parsedBody.key);
    const t = todos.findIndex(x => x.key === parsedBody.key);
    if (t < 0) {
      next();
    }
    todos[t] = parsedBody;
    const newData = JSON.stringify({ 
      "nextKey": nextKey, 
      "todos": todos
    }, null, 2);
    fs.writeFile('todos.json', newData, (err) => {
      if (err) { throw err; }
      res.statusCode = 204;
      res.end('PUT');
    });
  });
};

const deleteAllTodos = (req,res) => {
  todos.splice(0,todos.length);
  const newData = JSON.stringify({
    "nextKey": nextKey, 
    "todos": []
  }, null, 2);
  fs.writeFile('todos.json', newData, (err) => {
    if (err) { throw err; }
    res.statusCode = 204;
    res.end('CLEAR');
  });
};

const deleteOneTodo = (req,res,next) => {
  const key = Number(req.params.id);
  const t = todos.findIndex(x => x.key === key);
  if (t < 0) {
    next();
  }
  todos.splice(t,1);
  const newData = JSON.stringify({ 
    "nextKey": nextKey, 
    "todos": todos
  }, null, 2);
  fs.writeFile('todos.json', newData, (err) => {
    if (err) { throw err; }
    res.statusCode = 204;
    res.end('DELETE');
  });
};

app.use(cors());

app.get('/todos', getAllTodos);
app.get('/todos/:id', getOneTodo);
app.post('/todos', postTodo);
app.put('/todos', editTodo);
app.delete('/todos/:id', deleteOneTodo);
app.delete('/todos', deleteAllTodos);
app.use((req, res) => res.status(404).send('404: Not Found'));

fs.readFile('todos.json', 'utf-8', (err,data) => {
  if (err) { throw err; }
  parsedData = JSON.parse(data);
  nextKey = parsedData.nextKey;
  todos = parsedData.todos;
});

module.exports = app;