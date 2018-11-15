const http = require('http')
const querystring = require('querystring');
//const express = require('express')
const todos = []
//const todo = express()

//todo.use('/css', express.static('css'))

//todo.get('/', function(req, res){
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  console.log('Request was made: '+ req.url)
  if (req.method === 'GET') {
    res.end(JSON.stringify({ todos }));
  }
  else if (req.method === 'POST'){
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    })
    req.on('end', () => {
      const todo = querystring.parse(body)
      todos.push(todo)
      res.end('POSTed')
    })
  } 
  else {
    res.end('404: Not Found');
  }
})

server.listen(3000)
//todo.listen(3000)
console.log("Listening on post 3000")