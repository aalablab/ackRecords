if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const bodyParser = require('body-parser'); //install body-parser to get the needed data to pass into a post request.
const mysql = require('mysql');
const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.static('scripts'));
app.use(express.static('./archive'));
app.use(
  session({
    secret: process.env.SESSION_KEY, //'secret'
    resave: false,
    saveUninitialized: false,
    cookie: {
      //maxAge: 1000 * 60 * 60 * 24, //number (in milliseconds) to use when calculating the Expires = 24hrs
      maxAge: null,
    },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);

app.listen(process.env.PORT || 7070, function () {
  console.log('Server listening on port ' + process.env.PORT);
});
