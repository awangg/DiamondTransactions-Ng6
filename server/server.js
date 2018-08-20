/* Requires */
var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')

/* Config */
var app = express()
var port = process.env.PORT || 8081

var Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/storeng6')

app.use( bodyParser.urlencoded( {
  extended: true
}))
app.use(bodyParser.json())

app.listen(port, function() {
  console.log('Listening on ' + port)
})

/* Requests */
var router = express.Router()
router.use ( function(req, res, next) {
  next()
})
app.use('/', router)

/* User Config */
var userSchema = new Schema( {
  email: { type: String, trim: true },
  password: { type: String, trim: true },
  firstname: { type: String, trim: true, lowercase: true },
  lastname: { type: String, trim: true, lowercase: true },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true, uppercase: true },
  country: { type: String, trim: true },
  zipcode: { type: Number },
  creation: { type: Date, default: Date.now }
})
var User = mongoose.model('user', userSchema)

/* Login */
router.route('/api/login')
  .post( function(req, res) {
    User.findOne( { email: req.body.email }, function(err, user) {
      if(err) {
        res.json( {
          message: 'No User Found'
        })
        throw err
      }
      if(user === null) {
        res.json( {
          message: 'No User Found'
        })
      }else {
        if(user.password === req.body.password) {
          res.json({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            address: user.address,
            city: user.city,
            state: user.state,
            country: user.country,
            zipcode: user.zipcode
          })
        }else {
          res.json( {
            message: 'Incorrect Password'
          })
        }
      }
    })
  })

/* Sign Up */
router.route('/api/signup')
  .post( function(req, res) {
    var newUser = new User( {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      zipcode: req.body.zipcode,
    })
    newUser.save( function(err) {
      if(err) {
        res.json( {
          message: 'Error creating user'
        })
        throw err
      }
      res.json( {
        _id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        address: newUser.address,
        city: newUser.city,
        state: newUser.state,
        country: newUser.country,
        zipcode: newUser.zipcode
      })
    })
  })