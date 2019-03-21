const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const DB = require('./db');

module.exports = client => {
  const app = express();
  const db = DB(client);

  const getAllTodos = (req, res, next) => {
    db.getAll((err, data) => {
      if (err) return next(err);
      res.status(200).send(data);
    });
  };

  const getOneTodo = (req, res, next) => {
    const key = Number(req.params.id);
    db.getTodo(key, (err, data) => {
      if (err) return next(err);
      if (!data[0]) return next();
      res.status(200).send(data[0]);
    });
  };

  const postTodo = (req, res, next) => {
    const todo = req.body;
    const title = todo.title;
    const date = todo.date;
    const time = todo.time;
    const complete = todo.complete;
    db.createTodo(title, date, time, complete, (err, data) => {
      if (err) return next(err);
      res.status(201).send(data[0]);
    });
  };

  const editTodo = (req, res, next) => {
    const key = Number(req.params.id);
    const todo = req.body;
    const title = todo.title;
    const date = todo.date;
    const time = todo.time;
    const complete = todo.complete;
    db.updateTodo(key, title, date, time, complete, (err, data) => {
      if (err) return next(err);
      if (!data[0]) return next();
      res.status(204).send(data[0]);
    });
  };

  const deleteAllTodos = (req, res, next) => {
    db.deleteAll((err, data) => {
      if (err) return next(err);
      res.status(204).send(data);
    });
  };

  const deleteOneTodo = (req, res, next) => {
    const key = Number(req.params.id);
    db.deleteTodo(key, (err, data) => {
      if (err) return next(err);
      if (!data[0]) return next();
      res.status(204).send(data[0]);
    });
  };

  app.use(cors());
  app.une(bodyParser());
  app.get('/todos', getAllTodos);
  app.get('/todos/:id', getOneTodo);
  app.post('/todos', postTodo);
  app.put('/todos/:id', editTodo);
  app.delete('/todos/:id', deleteOneTodo);
  app.delete('/todos', deleteAllTodos);
  app.use((req, res) => res.status(404).send('404: Not Found'));

  return app;
};
