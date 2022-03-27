const express = require('express')
const router = express.Router()
const passport = require('passport')

const db = require('../../models')
const Todo = db.Todo
const User = db.User


// setting routes ('/auth')

// sending requests to facebook
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

// authenticate the data acquired from facebook  
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))


// export
module.exports = router