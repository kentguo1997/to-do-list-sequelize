const express = require('express')
const exphbs= require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const app = express()
const port = 3000

const db = require('./models')
const Todo = db.Todo
const User = db.User

app.engine('hbs', exphbs({
  defaultLayout: 'main', extname:'.hbs'
}))
app.set('view engine', 'hbs')


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// setting routes

// Home
app.get('/', (req, res) => {
  return Todo.findAll({
    raw: true,
    nest: true
  })
    .then((todos) => { return res.render('index', { todos: todos }) })
    .catch((error) => { return res.status(422).json(error) })
})

// show details of every to-do
app.get('/todos/:id', (req, res) => {
  const id = req.params.id

  return Todo.findByPk(id)
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})


// Login
app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

// Register
app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  
  User.findOne({ where: { email } })
  .then(user => {
    if (user) {
      console.log('User already exists!')
      return res.render('register', {
        name,
        email,
        password,
        confirmPassword
      })
    }

    return bcrypt.genSalt(10)
           .then(salt => bcrypt.hash(password, salt))
           .then(hash => {
             User.create({
               name,
               email,
               password: hash
             })
           })
           .then(() => res.redirect('/'))
           .catch(err => console.log(err))
  })
})

// Logout
app.get('/users/logout', (req, res) => {
  res.send('logout')
})


// start the server 
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})