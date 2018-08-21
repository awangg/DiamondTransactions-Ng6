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

/* Update Info */
router.route('/api/updateinfo')
  .post( function(req, res) {
    User.findById(req.body._id, function(err, user) {
      if(err) {
        throw err
      }
      if(req.body.firstname.length > 0) user.firstname = req.body.firstname
      if(req.body.lastname.length > 0) user.lastname = req.body.lastname
      if(req.body.email.length > 0) user.email = req.body.email
      if(req.body.address.length > 0) user.address = req.body.address
      if(req.body.city.length > 0) user.city = req.body.city
      if(req.body.state.length > 0) user.state = req.body.state
      if(req.body.country.length > 0) user.country = req.body.country
      if(user.zipcode !== null) user.zipcode = req.body.zip
      user.save( function(err) {
        if(err) {
          throw err
        }
        res.json( {
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
      })
    })
  })

/* Item */
var itemSchema = new Schema( {
  name: { type: String, trim: true },
  store_id: { type: String, trim: true },
  quantity: { type: Number, min: 1 },
  price: { type: Number, min: 50 },
  user: { type: Schema.Types.ObjectId }
})
var Item = mongoose.model('item', itemSchema)

/* Add to Cart */
router.route('/api/appendcart')
  .post( function(req, res) {
    Item.findOne( { user: req.body.user_id, store_id: req.body.product.store_id }, function(err, item) {
      if(err) {
        throw err
      }
      if(item === null) {
        var newItem = new Item( {
          name: req.body.product.name,
          store_id: req.body.product.store_id,
          user: req.body.user_id,
          price: req.body.price,
          quantity: 1
        })
        newItem.save( function(err) {
          if(err) {
            throw err
          }
          res.json( {
            message: 'Success'
          })
        })
      }else {
        item.quantity += 1
        item.save( function(err) {
          if(err) {
            throw err
          }
          res.json( {
            message: 'Success'
          })
        })
      }
    })
  })

/* Get Cart Contents */
router.route('/api/getcart')
  .post( function(req, res) {
    Item.find( { user: req.body.user_id }, function(err, items) {
      if(err) {
        throw err
      }
      var ret = [];
      items.forEach( function(item) {
        ret.push(item)
      })
      res.json(ret)
    })
  })

/* Remove from Cart */
router.route('/api/removecart')
  .post( function(req, res) {
    Item.deleteOne( { user: req.body.user_id, _id: req.body.product._id }, function(err) {
      if(err) {
        throw err
      }
      res.json( {
        message: 'Success'
      })
    })
  })

/* Orders */
var orderSchema = new Schema( {
  user: { type: Schema.Types.ObjectId },
  price: { type: Number, min: 50 },
  placement: { type: Date, default: Date.now },
  arrival: { type: Date, default: +new Date() + 7*24*60*60*1000 },
  items: { type: [itemSchema] }
})
var Order = mongoose.model('order', orderSchema)

/* Make Order */
router.route('/api/addorder')
  .post( function(req, res) {
    var newOrder = new Order( {
      user: req.body.user_id,
      price: req.body.price,
      items: req.body.cart
    })

    newOrder.save( function(err) {
      if(err) {
        throw err
      }
    })

    Item.deleteMany( { user: req.body.user_id }, function(err) {
      if(err) {
        throw err
      }
    })

    res.json( {
      message: 'Success'
    })
  })

/* Get Orders */
router.route('/api/getorders')
  .post( function(req, res) {
    Order.find( { user: req.body.user_id }, function(err, orders) {
      if(err) {
        throw err
      }
      var ret = []
      orders.forEach( function(order) {
        ret.push(order)
      })
      res.json(ret)
    })
  })
