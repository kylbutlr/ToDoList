# To-do List API

#### RESTful API for a basic to-do list application

Created to be used with [To-do List (React)](https://github.com/kylbutlr/todo-list-react)

Uses: PostgreSQL, Express, and Jest

## How to Use:

API Endpoint: ```https://kylbutlr-todos-api.herokuapp.com/```

[Click here for an example](https://kylbutlr-todos-api.herokuapp.com/todos) (this link goes to /todos)

Alternatively, download this repository and run the server locally:

1. Install the dependencies: ```npm install```
2. Run unit and integration tests: ```npm test```
3. Start the server: ```npm start``` 
4. API can be found at: ```localhost:3000```

### Requests:

| HTTP   | Request    | Response                            |
| ------ | ---------- | ----------------------------------- |
| GET    | /todos     | Returns all to-dos                   |
| GET    | /todos/:id | Returns one to-do selected by the ID |
| POST   | /todos     | Creates a new to-do                  |
| PUT    | /todos/:id | Edits a to-do selected by the ID     |
| DELETE | /todos     | Deletes all to-dos                   |
| DELETE | /todos/:id | Deletes one to-do selected by the ID |

***

## Contributing:

[@kylbutlr](https://github.com/kylbutlr)

## License:

MIT

