var express = require('express')
const bcrypt = require('bcrypt')
const { User, validate } = require('../models/user')
var router = express.Router()

/* GET home page. */
router.get('/', async (req, res) => {
  res.json({
    'status': 'success',
    'message': 'Welcome to the blog API'
  })
})

router.post('/login', async (req, res) => {
  let user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).json({
    'status': 'error',
    'message': 'Invalid email/password combination'
  })

  // Check password
  bcrypt.compare(req.body.password, user.password, (error, matched) => {
    if (!error && matched) {
      res.status(201).json({
        'status': 'success',
        'token': user.generateAuthToken()
      })
    }
    else {
      res.status(401).json({
        'status': 'error',
        'message': 'Sorry, something went wrong!'
      })
    }
  })
})

router.post('/register', async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).json({
    'status': 'error',
    'message': error.details[0].message
  })

  // Check for duplicate email
  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).json({
    'status': 'error',
    'message': 'This email has already been registered'
  })

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })
  user.password = await bcrypt.hash(user.password, 10)
  await user.save()

  const token = user.generateAuthToken()
  res.header('x-auth-token').json({
    'status': 'success',
    'token': token
  })
})

module.exports = router
