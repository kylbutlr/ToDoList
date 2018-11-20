const http = require('http')
const fs = require('fs')
const querystring = require('querystring')
//const express = require('express')
//const todo = express()
const todos = []
  //[{"text": "Delete this item", "realtime": "", "date": "2018-11-15", "done": "true", "key": 0},
  //{"text": "Add more to my list", "realtime": "", "date": "2018-11-15", "done":"false", "key": 1}]
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
    req.on('end', () => {
      fs.readFile('todos.json', 'utf-8', (err,data) => {
        if (err) { throw err }
        res.end(JSON.stringify({data}))
      })
    })
  }
  if (req.method === 'GET' && /\/todos\/[0-9]+/.test(req.url)) {
    const key = Number(req.url.match(/[0-9]+$/)[0])
    res.end(JSON.stringify({ 
      todo: todos.find(t => t.key === key) 
    }))
  }

  else if (req.method === 'POST'){
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      fs.readFile('todos.json', 'utf8', (err,data) => {
        if (err) { throw err }
        let obj = JSON.parse(data)
        const todo = querystring.parse(body)
        todo.key = nextKey
        nextKey++
        obj.push(todo)
        let newData = JSON.stringify(obj)
        fs.writeFile('todos.json', newData, (err) => {
          if (err) { throw err }
        })
        res.end('POST')
      })
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

  else if (req.method === 'DELETE' && /\/todos\/[0-9]+/.test(req.url)){
    const key = Number(req.url.match(/[0-9]+$/)[0])
    todos.splice(key,1)
    res.end('DELETE')
  }
  else if (req.method === 'DELETE'){
    todos.splice(0,todos.length)
    nextKey = findKey()
    res.end('CLEAR')
  }

  else {
    res.end('404: Not Found')
  }
})

server.listen(3000)
//todo.listen(3000)
console.log("Listening on post 3000")