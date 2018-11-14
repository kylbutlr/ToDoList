/* jshint asi: true */
/* jshint esversion: 6 */

const http = require('http')
const fs = require('fs')
//const express = require('express')
//const todo = express()

//todo.use('/css', express.static('css'))

//todo.get('/', function(req, res){
const server = http.createServer((req, res) => {
  console.log('Request was made: '+ req.url)
  const todos = []
  res.setHeader("Access-Control-Allow-Origin", "*")
  if (req.url === '/todos') {
    res.end(JSON.stringify({ todos }));
  } else {
    res.end('404: Not Found');
  }
})

server.listen(3000)
//todo.listen(3000)
console.log("Listening on post 3000")