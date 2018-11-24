const http = require('http')
const fs = require('fs')
const querystring = require('querystring')
//const express = require('express')
//const todo = express()
let todos;
let nextKey;

//todo.use('/css', express.static('css'))

//todo.get('/', function(req, res){
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "*") 
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  console.log('Request: '+ req.url)

  if (req.method === 'GET' && req.url === '/todos') {
    fs.readFile('todos.json', 'utf-8', (err,data) => {
      if (err) { throw err }
      res.statusCode = 200
      res.end(data)
    })
  }

  else if (req.method === 'GET' && /\/todos\/[0-9]+/.test(req.url)) {
    const key = Number(req.url.match(/[0-9]+$/)[0])
    fs.readFile('todos.json', 'utf-8', (err,data) => {
      if (err) { throw err }
      parsedData = JSON.parse(data)
      res.statusCode = 200
      res.end(JSON.stringify({ 
        todo: parsedData.todos.find(t => t.key === key)
      }))
    })
  }

  else if (req.method === 'POST' && req.url === '/todos'){
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      fs.readFile('todos.json', 'utf8', (err,data) => {
        if (err) { throw err }
        const todosData = JSON.parse(data)
        const todo = querystring.parse(body)
        todo.key = nextKey
        nextKey++
        todosData.todos.push(todo)
        todos = todosData.todos
        const newData = JSON.stringify({ 
          "nextKey": nextKey, 
          "todos": todosData.todos
        }, null, 2)
        fs.writeFile('todos.json', newData, (err) => {
          if (err) { throw err }
          res.statusCode = 201
          res.end('POST')
        })
      })
    })
  } 

  else if (req.method === 'PUT' && req.url === '/todos'){
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const parsedBody = JSON.parse(body)
      parsedBody.key = parseInt(parsedBody.key)
      const t = todos.findIndex(x => x.key == parsedBody.key)
      todos[t] = parsedBody
      const newData = JSON.stringify({ 
        "nextKey": nextKey, 
        "todos": todos
      }, null, 2)
      fs.writeFile('todos.json', newData, (err) => {
        if (err) { throw err }
        res.statusCode = 201
        res.end('PUT')
      })
    })
  }

  else if (req.method === 'DELETE' && req.url === '/todos'){
    todos.splice(0,todos.length)
    const newData = JSON.stringify({
      "nextKey": nextKey, 
      "todos": []
    }, null, 2)
    fs.writeFile('todos.json', newData, (err) => {
      if (err) { throw err }
      res.statusCode = 200
      res.end('CLEAR')
    })
  }

  else if (req.method === 'DELETE' && /\/todos\/[0-9]+/.test(req.url)){
    const key = Number(req.url.match(/[0-9]+$/)[0])
    const t = todos.findIndex(x => x.key == key)
    todos.splice(t,1)
    const newData = JSON.stringify({ 
      "nextKey": nextKey, 
      "todos": todos
    }, null, 2)
    fs.writeFile('todos.json', newData, (err) => {
      if (err) { throw err }
      res.statusCode = 200
      res.end('DELETE')
    })
  }

  else {
    res.statusCode = 404
    res.end('404: Not Found')
  }
})

fs.readFile('todos.json', 'utf-8', (err,data) => {
  if (err) { throw err }
  parsedData = JSON.parse(data)
  nextKey = parsedData.nextKey
  todos = parsedData.todos
  server.listen(3000)
})

//{"text": "Delete this item", "time24": "", "date": "2018-11-15", "done": "true", "key": 0}
//{"text": "Add more to my list", "time24": "", "date": "2018-11-15", "done":"false", "key": 1}