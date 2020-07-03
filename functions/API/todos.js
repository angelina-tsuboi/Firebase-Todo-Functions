const { db } = require('../util/admin');

exports.getAllTodos = (request, response) => {
	db
		.collection('todos')
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
        createdAt: new Date().toISOString()
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