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
//const fs = require('fs');
//const querystring = require('querystring');
//let todos;
//let nextKey;

client.connect();

const getAllTodos = (req,res) => {
  db.getAll((err, data) => {
    if (err) return err;
    res.status(200).send(data);
  });
};

const getOneTodo = (req,res,next) => {
  const key = Number(req.params.id);
  db.getTodo(key, (err, data) => {
    if (err) return err;
    if (!data[0]) return next();
    res.status(200).send(data[0]);
  });
};

const postTodo = (req,res) => {
  const title = req.params.title;
  const date = req.params.date;
  const complete = req.params.complete;
  db.createTodo(title, date, complete, (err, data) => {
    /*console.log(title);
    console.log(date);
    console.log(complete);*/
    if (err) return err;
    res.status(201).send(data);
  });
};

const editTodo = (req,res,next) => {
  const key = Number(req.params.id);
  const todo = req.params.todo;
  /*console.log(key);
  console.log(todo);*/
  db.createTodo(key, title, date, complete, (err, data) => {
    if (err) return err;
    if (!data[0]) return next();
    res.status(204).send(data);
  });
};

const deleteAllTodos = (req,res) => {
  db.deleteAll((err, data) => {
    if (err) return err;
    res.status(204).send(data);
  });
};

const deleteOneTodo = (req,res,next) => {
  const key = Number(req.params.id);
  db.deleteTodo(key, (err, data) => {
    /*console.log(key);
    console.log(data);
    console.log(data[0]);*/
    if (err) return err;
    if (!data[0]) return next();
    res.status(204).send(data[0]);
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

module.exports = app;
