const express = require('express')

const session = require('express-session')
const passportUse = require('./config/passport')
const passport = require('passport')

const exphbs= require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('./models')
const Todo = db.Todo
const User = db.User

const app = express()
const port = process.env.PORT

app.engine('hbs', exphbs({
  defaultLayout: 'main', extname:'.hbs'
}))
app.set('view engine', 'hbs')


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
passportUse(app)

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

app.post('/users/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

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
           .then(() => res.redirect('/users/login'))
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