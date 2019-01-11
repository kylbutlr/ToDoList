const {Client} = require('pg');
const App = require('./app');
const DB = require('./db');
let app;
let db;
let client;
client = new Client({
  user: 'postgres',
  password: 'pass',
  database: 'todos'
});
client.connect();
db = DB(client);
app = App(client);
app.listen(3000);