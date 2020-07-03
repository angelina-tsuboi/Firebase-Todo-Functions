const { db } = require('../util/admin');

exports.getAllTodos = (request, response) => {
	db
        .collection('todos')
        .where('username', '==', request.user.username)
        .orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let todos = [];
			data.forEach((doc) => {
				todos.push({
                    todoId: doc.id,
                    title: doc.data().title,
					body: doc.data().body,
					createdAt: doc.data().createdAt,
				});
			});
			return response.json(todos);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.getOneTodo = (request, response) => {
    const document = db.doc(`/todos/${request.params.todoId}`);
    document.get().then((doc) => {
        if(!doc.exists){
            return response.status(404).json({error: "Todo Item not found"})
        }
        return response.json({
            todoId: doc.id,
            title: doc.data().title,
            body: doc.data().body,
            createdAt: doc.data().createdAt
        })
    })
}

exports.postOneTodo = (request, response) => {
    if(request.body.body.trim() === ''){
        return response.status(400).json({body: 'Text must be filled'})
    }

    if(request.body.title.trim() === ''){
        return response.status(400).json({title: 'Text must be filled'})
    }

    const newTodo = {
        body: request.body.body,
        title: request.body.title,
        createdAt: new Date().toISOString(),
        username: request.user.username
    }

    db.collection('todos').add(newTodo)
    .then((doc) => {
        const responseTodoItem = newTodo;
        responseTodoItem.id = doc.id;
        return response.json(responseTodoItem);
    })
    .catch(err => {
        response.status(500).json({error: 'Something went wrong'})
        console.error(err);
    })
}

exports.deleteTodo = (request, response) => {
    const document = db.doc(`/todos/${request.params.todoId}`);
    document.get().then((doc) => {
        if(!doc.exists){
            return response.status(404).json({error: "Todo Item not found"})
        }

        if(doc.data().username !== request.user.username){
            return response.status(403).json({error:"UnAuthorized"})
       }
       
        return document.delete();
    })
    .then(() => {
        response.json({message: "Delete successfull"})
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({error: err.code})
    })
}

exports.editTodo = (request, response) => {
    if(request.body.todoId || request.body.createdAt){
        response.status(403).json({message: 'Not allowed to edit'});
    }

    const document = db.doc(`/todos/${request.params.todoId}`);
    document.update(request.body)
    .then(() => {
        response.json({message: 'Updated successfully'})
    })
    .catch(err => {
        console.error(err);
        return response.status(500).json({
            error: err.code 
        })
    })
}