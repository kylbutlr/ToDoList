# Todo List (API)
### Todo list application REST API
##### Features: CRUD, routing, and tests
##### Using: PostgreSQL, Express, and Jest
### [Can be used with Todo List (React)](https://github.com/kylbutlr/todo-list-react)

## Install

```bash
npm install
```

## Usage

```bash
npm start
```

Runs on port `3000`

## API

HTTP   | Request              | Response
--- | --- | ---
GET    | /todos     | Returns all todos
GET    | /todos/:id | Returns one todo selected by the ID
POST   | /todos     | Creates a new todo
PUT    | /todos/:id | Edits a todo selected by the ID
DELETE | /todos     | Deletes all todos
DELETE | /todos/:id | Deletes one todo selected by the ID

## Contributing

[@kylbutlr](https://github.com/kylbutlr)

PRs accepted.

## License

MIT
