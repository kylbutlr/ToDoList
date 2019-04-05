# Todo List API

#### Todo List application RESTful API

Created to be used with my [Todo List (React)](https://github.com/kylbutlr/todo-list-react) front-end

Features: REST CRUD, routing, and tests

Uses: PostgreSQL, Express, and Jest

## Usage

The API can be found at: ```https://kylbutlr-todos-api.herokuapp.com/```

[Click here for an example](https://kylbutlr-todos-api.herokuapp.com/todos). (This link goes to /todos)

Alternatively, download this repository and run the server locally:

1. Install the dependencies: ```npm install```
2. Run unit and integration tests: ```npm test```
3. Start the server: ```npm start``` 
4. API can be found at: ```localhost:3000```

### Requests:

| HTTP   | Request    | Response                            |
| ------ | ---------- | ----------------------------------- |
| GET    | /todos     | Returns all todos                   |
| GET    | /todos/:id | Returns one todo selected by the ID |
| POST   | /todos     | Creates a new todo                  |
| PUT    | /todos/:id | Edits a todo selected by the ID     |
| DELETE | /todos     | Deletes all todos                   |
| DELETE | /todos/:id | Deletes one todo selected by the ID |

***

## Contributing

[@kylbutlr](https://github.com/kylbutlr)

#### Special Thanks: 

[@NoumanSaleem](https://github.com/NoumanSaleem)

## License

MIT
