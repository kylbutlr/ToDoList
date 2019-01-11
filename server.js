const {Client} = require('pg');
const App = require('./app');
const DB = require('./db');
const client = new Client({
  user: 'postgres',
  password: 'pass',
  database: 'todos'
});
client.connect();
const db = DB(client);
const app = App(client);
app.listen(3000);