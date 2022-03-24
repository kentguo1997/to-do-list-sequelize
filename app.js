const express = require('express')
const exphbs= require('express-handlebars')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const app = express()
const port = 3000


app.engine('hbs', exphbs({
  defaultLayout: 'main', extname:'.hbs'
}))
app.set('view engine', 'hbs')


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// setting routes
// Home
app.get('/', (req, res) => {
  res.render('index')
})

// Login, Logout & Register
app.get('/users/login', (req, res) => {
  res.render('login')
})

app.post('/users/login', (req, res) => {
  res.send('login')
})

app.get('/users/register', (req, res) => {
  res.render('register')
})

app.post('/users/register', (re, res) => {
  res.send('register')
})

app.get('/users/logout', (req, res) => {
  res.send('logout')
})


// start the server 
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})