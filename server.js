const { Client } = require('pg');
const App = require('./app');
const client = new Client({
  user: 'rkrtjfhetbrpso',
  password: '6995b828e011276cc49322a5740b10da2a87c95ff2c5055eece0154e6b5e3835',
  port: '5432',
  database: 'dars6i8a5faoqk',
  ssl: 'true',
  connectionString:
    'postgres://rkrtjfhetbrpso:6995b828e011276cc49322a5740b10da2a87c95ff2c5055eece0154e6b5e3835@ec2-23-23-241-119.compute-1.amazonaws.com:5432/dars6i8a5faoqk',
});
client.connect();
const app = App(client);
app.listen(3000);
