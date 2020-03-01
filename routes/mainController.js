var express = require('express');
var router = express.Router();

var theDB = require('../util/db');

var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {useNewUrlParser: true});
var db = mongoose.connection;

var employeeSchema = new mongoose.Schema({
    name: String,
    id: Number,
    email: String,
    uname: String,
    pass: String,
    groupIDs: [],
    monAvail: []
},{collection: 'employee'});

var EmployeeModel = db.model('Employee', employeeSchema);

//var mysql = require('mysql');

db.once('open', function(){
    console.log('Connected to database');
    //test
    //can comment the below statement out later, this proves that the db
    //can be accessed and data can be pulled from it
    theDB.getAll(EmployeeModel).then(function(doc){
        console.log(JSON.stringify(doc));
    });
});

var viewAddress;
var viewData;

router.get("/*", function(req, res, next){
    console.log("checking session");
    let sessionProfile = req.session.currentProfile;

    if (typeof sessionProfile != 'undefined'){
        res.locals.theUser = req.session.theUser;
    }
    next();
});

router.get('/', function(req, res, next){
    //render homepage
    console.log('render index');
    res.render('index');
});

router.get('/help', function(req, res, next){
    //render help page
    console.log('render help');
    res.render('help');
});

router.get('/about', function(req,res,next){
    //render about page
    console.log('render about');
    res.render('about');
})

module.exports = router;