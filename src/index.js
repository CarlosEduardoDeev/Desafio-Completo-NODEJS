const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];




function checksExistsUserAccount(request, response, next) {

    const { username } = request.headers;

    const user = users.find((user) => user.username === username)

    if (!user) {
      return response.status(404).json({ error: "Usuario nao encontrado " });
    }

    console.log(username)
   

     request.user = user

     return next()
  // // Complete aqui
}



app.post('/users', (request, response) => {

  const {username,name} = request.body

  const userAlreadyExists = users.some((users)  => users.username === username)

  if(userAlreadyExists){
      return response.status(400).json({error:"Usuario ja existe "})
  }

    const user = {
    username,
    name,
    id:uuidv4(),
    todos:[]
  }

  users.push(user);

  return response.status(201).json(user)
  // Complete aqui
});

app.get('/todos', checksExistsUserAccount, (request, response) => {

    const {user} = request

    return response.status(201).json(user.todos)
  // Complete aqui
}); //ok

app.post('/todos', checksExistsUserAccount, (request, response) => {

    const { title,deadline } = request.body

    const { user } = request

    const task = {
      id: uuidv4(),
	    title: title,
	    done: false, 
	    deadline: new Date(deadline), 
	    created_at: new Date()
    }

    console.log(task)

    user.todos.push(task)


    return response.status(201).json(task)

  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const { user } = request
    const {title,deadline} = request.body
    const {id} = request.params

    const todos = user.todos.find((todos) => todos.id === id)

    if(!todos){
      return response.status(404).json({error:"Todo não encontrado"})
    }

    todos.title = title
    todos.deadline = deadline

    return response.status(201).json(todos)

  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const {id} = request.params

  const todos = user.todos.find((todos) => todos.id === id)

  if(!todos){
    return response.status(404).json({error:"Todo não encontrado"})
  }

  todos.done = true

  return response.json(todos)

  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params

  const todos = user.todos.find((todos) => todos.id === id)

  if(!todos){
    return response.status(404).json({error:"Todo não encontrado"})
  }
  
  user.todos.splice(todos,1)

  return response.status(204).json()

  // Complete aqui
});

module.exports = app;