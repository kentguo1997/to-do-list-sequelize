const express = require('express')

const session = require('express-session')
const passportUse = require('./config/passport')


const exphbs= require('express-handlebars')
const methodOverride = require('method-override')


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require('./models')


const routes = require('./routes')
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

app.use(routes)


// start the server 
app.listen(port, () => {
  console.log(`The server is listening on http://localhost:${port}`)
})