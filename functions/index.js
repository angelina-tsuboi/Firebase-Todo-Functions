const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllTodos,
    postOneTodo,
    deleteTodo,
    editTodo
} = require('./API/todos') //todo data stuff

const {
    loginUser
} = require('./API/users') //user stuff

app.get('/todos', getAllTodos);
app.post('/todo', postOneTodo);
app.delete('/todo/:todoId', deleteTodo);
app.put('/todo/:todoId', editTodo);

exports.api = functions.https.onRequest(app);

//export GOOGLE_APPLICATION_CREDENTIALS="/Users/Angelina/Downloads/todocreds.json"