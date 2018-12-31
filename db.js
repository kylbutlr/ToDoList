module.exports = client => ({
  getAll: cb => client.query('SELECT * FROM todos', (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  getTodo: (id, cb) => client.query('SELECT * FROM todos WHERE id = $1', [id], (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  createTodo: (title, cb) => client.query('INSERT INTO todos (title) VALUES ($1)', [title], (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  updateTodo: (id, cb) => client.query('UPDATE $1 FROM todos', [id], (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  deleteAll: cb => client.query('DELETE * FROM todos', (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  deleteTodo: (id, cb) => client.query('DELETE $1 FROM todos', [id], (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  })
});
