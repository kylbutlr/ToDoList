module.exports = client => ({
  getAll: cb => client.query('SELECT * FROM todos', (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  getTodo: (id, cb) => client.query('SELECT * FROM todos WHERE id = $1', [id], (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  createTodo: (title, cb) => client.query('INSERT INTO todos (title) VALUES ($1) RETURNING *', [title], (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  updateTodo: (id, title, cb) => client.query('UPDATE todos SET title = $2 WHERE id = $1 RETURNING *', [id, title], (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  deleteAll: cb => client.query('DELETE FROM todos RETURNING *', (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  deleteTodo: (id, cb) => client.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id], (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  })
});
