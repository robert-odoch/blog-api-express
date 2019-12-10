var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('config')
const mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Ensure that the private key is set
if (!config.get('privateKey')) {
  console.error('privateKey is not defined')
  process.exit(1)
}

// Connect to db
mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true })
  .then(() => console.log('Connected to mongodb'))
  .catch(e => console.error('Could not connect to mongodb'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
