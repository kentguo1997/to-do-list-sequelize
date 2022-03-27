const express = require('express')
const router = express.Router()

// Include routes modules
const home = require('./modules/home')
const todos = require('./modules/todos')
const users = require('./modules/users')
const auth = require('./modules/auth')

const { authenticator } = require('../middleware/auth') 


// setting routes
router.use('/users', users)
router.use('/todos', authenticator, todos)
router.use('/auth', auth)
router.use('/', authenticator, home)


// export for controller's use
module.exports = router
