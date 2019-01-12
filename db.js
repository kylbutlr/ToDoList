module.exports = client => ({
  getAll: cb => client.query('SELECT * FROM todos', (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  getTodo: (id, cb) => client.query('SELECT * FROM todos WHERE id = $1', [id], (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  createTodo: (title, date, time, complete, cb) => client.query('INSERT INTO todos (title, date, time, complete) VALUES ($1, $2, $3, $4) RETURNING *', [title, date, time, complete], (err, res) => {
    if (err) return cb(err);
    cb(null, res.rows);
  }),
  updateTodo: (id, title, date, time, complete, cb) => client.query('UPDATE todos SET title = $2, date = $3, time = $4, complete = $5 WHERE id = $1 RETURNING *', [id, title, date, time, complete], (err, res) => {
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
