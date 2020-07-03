const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./util/auth');

const {
    getAllTodos,
    postOneTodo,
    deleteTodo,
    getOneTodo,
    editTodo
} = require('./API/todos') //todo data stuff

const {
    loginUser,
    signUpUser,
    uploadProfileImage,
    getUserData,
    updateUserData
} = require('./API/users') //user stuff

//TODOS
app.get('/todos', auth, getAllTodos);
app.get('/todo/:todoId', auth, getOneTodo);
app.post('/todo',auth, postOneTodo);
app.delete('/todo/:todoId',auth, deleteTodo);
app.put('/todo/:todoId',auth, editTodo);
//USERS
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfileImage);
app.get('/user', auth, getUserData);
app.post('/user', auth, updateUserData)


exports.api = functions.https.onRequest(app);

//export GOOGLE_APPLICATION_CREDENTIALS="/Users/Angelina/Downloads/todocreds.json"