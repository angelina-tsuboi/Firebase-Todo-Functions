const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllTodos,
    postOneTodo
} = require('./API/todos')

app.get('/todos', getAllTodos);
app.post('/todo', postOneTodo);

exports.api = functions.https.onRequest(app);

//export GOOGLE_APPLICATION_CREDENTIALS="/Users/Angelina/Downloads/todocreds.json"