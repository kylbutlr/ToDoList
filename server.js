const http = require('http')
const querystring = require('querystring')
//const express = require('express')
//const todo = express()
const todos = []
let key

//todo.use('/css', express.static('css'))

//todo.get('/', function(req, res){
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT');
  console.log('Request was made: '+ req.url)
  if (req.method === 'GET') {
    res.end(JSON.stringify({ todos }))
  }
  else if (req.method === 'POST'){
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const todo = querystring.parse(body)
      //todo.key = key
      todos.push(todo)
      key++
      res.end('POST')
    })
  } 
  else if (req.method === 'PUT'){
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const savedTodos = querystring.parse(body)
      console.log(todos)
      for (i=0;i<savedTodos.length;i++){
        todos.push(savedTodos[i])
      }
      res.end("PUT")
    })
  }
  else {
    res.end('404: Not Found')
  }
})

server.listen(3000)
//todo.listen(3000)
console.log("Listening on post 3000")