const { Client } = require('pg');
const App = require('./app');
const client = new Client({
  user: 'bsndzkjhbniysd',
  password: 'b0e85b1ed413e75f5d8447542dfb2eaf67b1563cb26f8d71746045cea205222f',
  database: 'dfq3ajdeehcpp4',
  port: 5432,
  host: 'ec2-50-17-231-192.compute-1.amazonaws.com',
  ssl: true
});
client.connect();
const app = App(client);
app.listen(process.env.PORT || 3000);
