const {Client} = require('pg');
const App = require('./app');
const client = new Client({
  user: 'postgres',
  password: 'pass',
  database: 'todos'
});
client.connect();
const app = App(client);
app.listen(3000);