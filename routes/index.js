const express = require('express')
const router = express.Router()

// Include routes modules
const home = require('./modules/home')
const todos = require('./modules/todos')
const users = require('./modules/users')


// setting routes
router.use('/users', users)
router.use('/todos', todos)
router.use('/', home)


// export for controller's use
module.exports = router
