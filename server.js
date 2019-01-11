const App = require('./app');
const client = new Client({
    user: 'postgres',
    password: 'pass',
    database: 'todos'
  });
const app = App(client);
app.listen(3000);