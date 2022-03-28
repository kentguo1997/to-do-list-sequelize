const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo
const User = db.User


// setting routes ('/')
router.get('/', (req, res) => {
  const UserId = req.user.id
  const deadlineMonth = []

  return Todo.findAll({
    where: { UserId }, raw: true, nest: true, order: [
      ['dueDate', 'ASC'],
    ] })
    .then((todos) => { 
      todos.forEach(todo => {
        const todoMonth = todo.dueDate.slice(0, 7)
        if (!deadlineMonth.includes(todoMonth)){
          deadlineMonth.push(todoMonth)
        }
      })
      return res.render('index', { todos, deadlineMonth }) 
    })
    .catch((error) => { return res.status(422).json(error) })
})


// export
module.exports = router