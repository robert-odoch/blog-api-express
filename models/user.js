const mongoose = require('mongoose')
const config = require('config')
const jwt = require('jsonwebtoken')
const joi = require('joi')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
  },

  // Give different access rights if admin or root
  isAdmin: Boolean
})

// Custom method to generate auth token
UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('privateKey'))

  return token
}

const User = mongoose.model('User', UserSchema)

// Function to validate user
function validateUser(user) {
  const schema = {
    name: joi.string().min(3).max(50).required(),
    email: joi.string().min(5).max(255).required().email(),
    password: joi.string().min(6).max(255).required()
  }

  return joi.validate(user, schema)
}

exports.User = User
exports.validate = validateUser
