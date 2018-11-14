/* jshint asi: true */
/* jshint esversion: 6 */

const fs = require('fs')
const express = require('express')
const todo = express()

todo.use('/css', express.static('css'))

todo.get('/', function(req, res){
  console.log('Request was made: '+ req.url)
  res.writeHead(200, {'Content-Type': 'text/html'})
  fs.createReadStream(__dirname + '/public/index.html').pipe(res)
})

todo.listen(3000)
console.log("Listening on post 3000")