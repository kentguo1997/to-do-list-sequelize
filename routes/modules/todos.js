const express = require('express')
const router = express.Router()


const db = require('../../models')
const Todo = db.Todo

let inputError = ''


// setting routes ('/todos')
// create new to-to
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const { name, dueDate } = req.body
  const UserId = req.user.id
  
  if(!name || !dueDate){
    inputError = 'Please fill out the form!'
    return res.render('new', {inputError, name, dueDate})
  }

  return Todo.create({
    name,
    dueDate,
    UserId,
    createdAt: new Date(),
    updatedAt: new Date()
  })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


// show details of every to-do
router.get('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id

  return Todo.findOne({ where: { UserId, id } })
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})


// edit to-do
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id

  return Todo.findOne({ where: { UserId, id } })
    .then(todo => {
      res.render('edit', { todo: todo.toJSON() })
    })
    .catch(err => console.log(err))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const { name, isDone, dueDate } = req.body
  const UserId = req.user.id

  Todo.findOne({ where: { UserId, id } })
    .then(todo => {
      if (!name || !dueDate) {
        inputError = 'Please fill out the form!'
        return res.render('edit', {
          inputError, todo: todo.toJSON()
        })
      }

      todo.id = id
      todo.name = name
      todo.isDone = isDone === 'on'
      todo.dueDate = dueDate
      todo.updatedAt = new Date()

      return todo.save().then(() => res.redirect(`/todos/${id}`))
    })
    .catch(err => console.log(err))

})


// delete to-do
router.delete('/:id', (req, res) => {
  const id = req.params.id
  const UserId = req.user.id

  Todo.findOne({ where: { UserId, id } })
    .then(todo => {
      return todo.destroy()
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))
})


// sort by the deadline of month
router.get('/deadline/:month', (req, res) => {
  const month = req.params.month
  const UserId = req.user.id
  const showTodos = []
  const deadlineMonth = []

  Todo.findAll({
    where: { UserId }, raw: true, nest: true, order: [
      ['dueDate', 'ASC'],
    ] })
  .then(todos => {
    todos.forEach(todo => {
      const todoDueMonth = todo.dueDate.slice(0, 7).toString()

      if(todoDueMonth === month){
        showTodos.push(todo)
      }
      if(!deadlineMonth.includes(todoDueMonth)){
        deadlineMonth.push(todoDueMonth)
      }
    })

    res.render('index', {
      deadlineMonth,
      todos: showTodos
    })
  })
  .catch(err => console.log(err))
})


// export
module.exports = router