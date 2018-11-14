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
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.end('Hello World!')
})

server.listen(3000)
//todo.listen(3000)
console.log("Listening on post 3000")