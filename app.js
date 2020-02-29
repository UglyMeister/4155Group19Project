//This is the application file for our node.js express app
//This app will control the main logic for the app as far as routing and loading pages, requests, and responses are concerned

var createError = require('http-errors');
var express = require('express');
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571');
var db = mongoose.connection;

var employeeSchema = new mongoose.Schema({
    name: String,
    id: Number,
    email: String,
    uname: String,
    pass: String,
    groupIDs: Array,
    monAvail: Array
});

var EmployeeModel = db.model('Employee', employeeSchema);
var path = require('path');
//var cookieParser = require('cookie-parser'); ADD THIS LATER
var mainController = require('./routes/mainController');

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
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.urlencoded({ extended: true }));

//session handling
var session = require('express-session');
//var cookieParser = require('cookie-parser');

//app.use(cookieParser());
app.use(session({secret: "the secret"}));

//routes
//define teh routes and add the controllers
app.use('/', mainController);

//catch 404 and forward to error handler
app.use(function(req, res, next){
    next(createError(404));
});

//error handler
app.use(function(err, req, res, next){
    //set locals, only providing error in dev
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    //render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.listen(port, function(){
    console.log('listening live');
});