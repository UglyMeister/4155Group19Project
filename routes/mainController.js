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
    monAvail: [],
    tueAvail: [],
    wedAvail: [],
    thAvail: [],
    friAvail: [],
    satAvail: [],
    sunAvail: []
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
});

router.get('/employee', function(req,res,next){
    //render employee view
    var uname;
    var pass;
    console.log('uname');
    console.log(req.query.uname);
    console.log('pass');
    console.log(req.query.pass);
    if(req.query.uname != null && req.query.pass != null){
        console.log('not null uname or pass');
        uname = req.query.uname;
        pass = req.query.pass;
        theDB.getOne(EmployeeModel, uname).then(function(doc){
            docPass = doc[0].pass;
             if(docPass == pass){
                   console.log('you are logged in');
                  res.render('employee');
             }else{
                  console.log('doc null');
                  res.render('index');
            }
        });
    }else{
        console.log('null uname or pass');
        res.render('index');
    }
    /*
    console.log('render employee');
    res.render('employee');*/
});

router.get('/employer', function(req,res,next){
    //render employer view
    console.log('render employer');
    res.render('employer');
});

module.exports = router;