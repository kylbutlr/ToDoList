const express = require('express');
const cors = require('cors');
//const app = express();
const {Client} = require('pg');
const DB = require('./db');
//const db = DB(client);
//const fs = require('fs');
//const querystring = require('querystring');
//let todos;
//let nextKey;
//client.connect();

module.exports = (client) => {
  const app = express();
  const db = DB(client);

  const getAllTodos = (req,res,next) => {
    db.getAll((err, data) => {
      if (err) return next(err);
      res.status(200).send(data);
    });
  };

  const getOneTodo = (req,res,next) => {
    const key = Number(req.params.id);
    db.getTodo(key, (err, data) => {
      if (err) return next(err);
      if (!data[0]) return next();
      res.status(200).send(data[0]);
    });
  };

  const postTodo = (req,res,next) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const todo = JSON.parse(body);
      const title = todo.title;
      const date = todo.date;
      const complete = todo.complete;
      db.createTodo(title, date, complete, (err, data) => {
        if (err) return next(err);
        res.status(201).send(data[0]);
      });
    });
  };

  const editTodo = (req,res,next) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const key = Number(req.params.id);
      const todo = JSON.parse(body);
      const title = todo.title;
      const date = todo.date;
      const complete = todo.complete;
      db.updateTodo(key, title, date, complete, (err, data) => {
        if (err) return next(err);
        if (!data[0]) return next();
        res.status(204).send(data[0]);
      });
    });
  };

  const deleteAllTodos = (req,res,next) => {
    db.deleteAll((err, data) => {
      if (err) return next(err);
      res.status(204).send(data);
    });
  };

  const deleteOneTodo = (req,res,next) => {
    const key = Number(req.params.id);
    db.deleteTodo(key, (err, data) => {
      /*console.log(key);
      console.log(data);
      console.log(data[0]);*/
      if (err) return next(err);
      if (!data[0]) return next();
      res.status(204).send(data[0]);
    });
  };

  app.use(cors());

  app.get('/todos', getAllTodos);
  app.get('/todos/:id', getOneTodo);
  app.post('/todos', postTodo);
  app.put('/todos/:id', editTodo);
  app.delete('/todos/:id', deleteOneTodo);
  app.delete('/todos', deleteAllTodos);
  app.use((req, res) => res.status(404).send('404: Not Found'));

  return app;
};
