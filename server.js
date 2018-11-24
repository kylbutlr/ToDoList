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
  console.log('Request was made: '+ req.url)

  if (req.method === 'GET' && req.url === '/todos') {
    fs.readFile('todos.json', 'utf-8', (err,data) => {
      if (err) { throw err }
      res.end(data)
    })
  }

  else if (req.method === 'GET' && /\/todos\/[0-9]+/.test(req.url)) {
    const key = Number(req.url.match(/[0-9]+$/)[0])
    fs.readFile('todos.json', 'utf-8', (err,data) => {
      if (err) { throw err }
      parsedData = JSON.parse(data)
      res.end(JSON.stringify({ 
        todo: parsedData.find(t => t.key === key)
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
        const newData = JSON.stringify({ 
          "nextKey": nextKey, 
          "todos": todosData.todos
        }, null, 2)
        fs.writeFile('todos.json', newData, (err) => {
          if (err) { throw err }
        })
        res.end('POST')
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
      const newData = JSON.stringify(todos, null, 2)
      fs.writeFile('todos.json', newData, (err) => {
        if (err) { throw err }
      })
      res.end('PUT')
    })
  }

  else if (req.method === 'DELETE' && req.url === '/todos'){
    todos.splice(0,todos.length)
    nextKey = findKey()
    fs.writeFile('todos.json', "[]", (err) => {
      if (err) { throw err }
    })
    res.end('CLEAR')
  }

  else if (req.method === 'DELETE' && /\/todos\/[0-9]+/.test(req.url)){
    const key = Number(req.url.match(/[0-9]+$/)[0])
    const t = todos.findIndex(x => x.key == key)
    todos.splice(t,1)
    const newData = JSON.stringify(todos, null, 2)
    fs.writeFile('todos.json', newData, (err) => {
      if (err) { throw err }
    })
    res.end('DELETE')
  }

  else {
    res.end('404: Not Found')
  }
})

function findKey() {
  if (todos.length != 0){
    return todos[todos.length-1].key + 1
  }
  else {
    return 0
  }
}

fs.readFile('todos.json', 'utf-8', (err,data) => {
  if (err) { throw err }
  todosData = JSON.parse(data)
  nextKey = todosData.nextKey
  server.listen(3000)
  console.log("Listening on post 3000")
})

  //[{"text": "Delete this item", "realtime": "", "date": "2018-11-15", "done": "true", "key": 0},
  //{"text": "Add more to my list", "realtime": "", "date": "2018-11-15", "done":"false", "key": 1}]