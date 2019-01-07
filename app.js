const fs = require('fs');
const querystring = require('querystring');
const express = require('express');
const cors = require('cors');
const app = express();
const { Client } = require('pg');
const DB = require('./db');
const client = new Client({
  user: 'postgres',
  password: 'pass',
  database: 'todos'
});
const db = DB(client);
let todos;
let nextKey;

client.connect();

const getAllTodos = (req,res) => {
  db.getAll((err, data) => {
    if (err) return err;
    res.statusCode = 200;
    res.send(data);
  });
};

const getOneTodo = (req,res,next) => {
  const key = Number(req.params.id);
  db.getTodo(key, (err, data) => {
    if (err) return err;
    if (!data[0]) return next();
    res.statusCode = 200;
    console.log(data[0]);
    console.log(data[key]);
    res.send(data[key]);
  });
};

const postTodo = (req,res) => {
  const title = req.params.title;
  const date = req.params.date;
  const complete = req.params.complete;
  /*let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {*/
    //fs.readFile('todos.json', 'utf8', (err,data) => {
    /*db.getAll((err, data) => {
      if (err) return err;
      console.log(data);*/
      //const todosData = JSON.parse(data);
      //const todo = querystring.parse(body);
      /*todo.key = nextKey;
      nextKey++;
      todosData.todos.push(todo);
      todos = todosData.todos;
      const newData = JSON.stringify({ 
        "nextKey": nextKey, 
        "todos": todosData.todos
      }, null, 2);*/
      //fs.writeFile('todos.json', newData, (err) => {
      db.createTodo(title, date, complete, (err, data) => {
        if (err) return err;
        console.log(title);
        console.log(date);
        console.log(complete);
        console.log(data);
        res.statusCode = 201;
        res.send(data);
      //});
    //});
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
