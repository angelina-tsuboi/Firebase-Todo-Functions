const functions = require('firebase-functions');
const app = require('express')();

const {
    getAllTodos,
    postOneTodo,
    deleteTodo,
    editTodo
} = require('./API/todos') //todo data stuff

const {
    loginUser,
    signUpUser
} = require('./API/users') //user stuff

//TODOS
app.get('/todos', getAllTodos);
app.post('/todo', postOneTodo);
app.delete('/todo/:todoId', deleteTodo);
app.put('/todo/:todoId', editTodo);
//USERS
app.post('/login', loginUser);
app.post('/signup', signUpUser);


exports.api = functions.https.onRequest(app);

//export GOOGLE_APPLICATION_CREDENTIALS="/Users/Angelina/Downloads/todocreds.json"