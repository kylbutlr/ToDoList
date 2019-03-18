const {Client} = require('pg');
const App = require('./app');
const client = new Client({
  user: 'rkrtjfhetbrpso',
  password: '6995b828e011276cc49322a5740b10da2a87c95ff2c5055eece0154e6b5e3835',
  database: 'dars6i8a5faoqk?ssl=true'
});
client.connect();
const app = App(client);
app.listen(3000);