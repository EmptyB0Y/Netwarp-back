var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {sequelize, Sequelize} = require('./models/index');
var cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const profileRouter = require('./routes/profiles');
const postRouter = require('./routes/posts');
const missionRouter = require('./routes/missions');
const commentaireRouter = require('./routes/comment');

var app = express();

sequelize.sync();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, multipart/form-data, JSON');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Cross-Origin-Embedder-Policy', '*');
  res.setHeader('Cross-Origin-Resource-Policy', '*');
  next();
});
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/profiles', profileRouter);
app.use('/posts', postRouter);
app.use('/missions', missionRouter);
app.use('/commentaires', commentaireRouter);
app.use('/images', express.static(path.join(__dirname, 'images')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
