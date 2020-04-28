//This is the application file for our node.js express app
//This app will control the main logic for the app as far as routing and loading pages, requests, and responses are concerned

var createError = require('http-errors');
var https = require('https');
var express = require('express');
var fs = require('fs');
var port = process.env.PORT || 8080;

var path = require('path');
//var cookieParser = require('cookie-parser'); ADD THIS LATER
const employeeRouter = require('./routes/employeeRouter');
var employerRouter = require('./routes/employerRouter');
var homeRouter = require('./routes/homeRouter');

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

//set the path for static resources to be accessible
app.use('/resources', express.static('resources'));

//post handling
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

//session handling
var session = require('express-session');
//var cookieParser = require('cookie-parser');

//app.use(cookieParser());
//THIS SESSION IS FOR TESTING ONLY
//app.use(session({ secret: 'the secret', saveUninitialized: false }));
//ENABLE THIS SESSION WHEN WE GO INTO PRODUCTION BC SECURE COOKIE
app.use(session({ secret: 'the secret',cookie: {secure: true}, saveUninitialized: false }));

//routes
//define teh routes and add the controllers
app.use('/', homeRouter);
app.use('/employee', employeeRouter);
app.use('/employer', employerRouter);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

//error handler
app.use(function (err, req, res, next) {
    //set locals, only providing error in dev
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    //render the error page
    res.status(err.status || 500);
    res.render('error');
});
https.createServer({
    key: 'ThisIsASecret',
    cert: fs.readFileSync('smartboss.pfx')
}, app)
.listen(port, function(){
    console.log('listening live');
});
/*
app.listen(port, function () {
    console.log('listening live');
});
*/