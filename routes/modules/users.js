const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const db = require('../../models')
const User = db.User

// setting routes ('/users')
// Login
router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

// Register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'Please fill out the form!' })
  }

  if (password !== confirmPassword) {
    errors.push({ message: 'Password do not match confirmPassword!' })
  }

  if (errors.length) {
    return res.render('register', {
      name,
      email,
      password,
      confirmPassword,
      errors
    })
  }

  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        errors.push({ message: 'User already exists!' })
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword,
          errors
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
router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', 'Logged out successfully!')
  res.redirect('/users/login')
})

// export
module.exports = router
