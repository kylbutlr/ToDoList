const http = require('http')
const querystring = require('querystring')
//const express = require('express')
//const todo = express()
const todos = [{"text": "Delete this item", "realtime": "", "date": "2018-11-15", "done": "true", "key": 0},
    {"text": "Add more to my list", "realtime": "", "date": "2018-11-15", "done":"false", "key": 1}]
let nextKey = findKey()

function findKey() {
  if (todos.length != 0){
    return todos[todos.length-1].key + 1
  }
  else {
    return 0
  }
}

//todo.use('/css', express.static('css'))

//todo.get('/', function(req, res){
const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "*") 
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
  console.log('Request was made: '+ req.url)
  if (req.method === 'GET') {
    res.end(JSON.stringify({ todos }))
  }
  if (req.method === 'GET' && req.url === '/todos/*') {
    res.end(JSON.stringify({ todos }))
  }
  else if (req.method === 'POST'){
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const todo = querystring.parse(body)
      todo.key = nextKey
      todos.push(todo)
      nextKey++
      res.end('POST')
    })
  } 
  else if (req.method === 'PUT'){
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const parsedBody = JSON.parse(body)
      parsedBody.key = parseInt(parsedBody.key)
      todos[parsedBody.key] = parsedBody
      res.end('PUT')
    })
  }
  else if (req.method === 'DELETE' && req.data == undefined){
    req.on('end', () => {
      todos.splice(0,todos.length)
      res.end('CLEARED ALL')
    })
  }
  else if (req.method === 'DELETE'){
    //const key = todos.findIndex(x => x.key == data.key)
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const key = parseInt(body)
      todos.splice(key, 1)
      res.end('DELETE')
    })
  }
  else {
    res.end('404: Not Found')
  }
})

server.listen(3000)
//todo.listen(3000)
console.log("Listening on post 3000")