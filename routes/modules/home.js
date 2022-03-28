const express = require('express')
const router = express.Router()

const db = require('../../models')
const Todo = db.Todo
const User = db.User


// setting routes ('/')
router.get('/', (req, res) => {
  const UserId = req.user.id

  return Todo.findAll({
    where: { UserId }, raw: true, nest: true, order: [
      ['dueDate', 'ASC'],
    ] })
    .then((todos) => { return res.render('index', { todos }) })
    .catch((error) => { return res.status(422).json(error) })
})


// export
module.exports = router