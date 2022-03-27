const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

module.exports = app => {
  // Initialization
  app.use(passport.initialize())
  app.use(passport.session())
  
  // Passport Local Strategy
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('error', 'User not found!'))
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, req.flash('error', 'Email or Password incorrect!'))
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

  // serialization & deserialization
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON()
        done(null, user)
      }).catch(err => done(err, null))
  })



}