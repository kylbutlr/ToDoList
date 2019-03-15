# Todo List (API)

### Todo List app public RESTful API, [can be used with Todo List (React)](https://github.com/kylbutlr/todo-list-react)

Using: PostgreSQL, Express, and Jest

Featuring: REST CRUD, routing, and tests

Currently does not feature user accounts, so all entries and modifications will be saved and displayed for all users.

## Install

```shell
npm install
```

## Usage

Server runs on port `3000`

```shell
npm start
```

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
