var express = require('express');
var router = express.Router();

var theDB = require('../util/db');
var employeeList;

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
        employeeList = doc;
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
    updateLocalDB();
    console.log('render index');
    res.render('index', {data:''});
});

router.get('/help', function(req, res, next){
    //render help page
    updateLocalDB();
    console.log('render help');
    res.render('help');
});

router.get('/about', function(req,res,next){
    //render about page
    updateLocalDB();
    console.log('render about');
    res.render('about');
});

router.get('/employee', function(req,res,next){
    //render employee view
    updateLocalDB();
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
        //no need to use this anymore
        //by loading the db contents into a js variable we can access the data much faster and easier
        //things will just be slighly different whenever we need to add users to the database
        //will require a new addition to the database and for the local variable to be updated
        /*theDB.getOne(EmployeeModel, uname).then(function(doc){
            docPass = doc[0].pass;
             if(docPass == pass){
                   console.log('you are logged in');
                  res.render('employee');
             }else{
                  console.log('doc null');
                  res.render('index');
            }
        });*/
        for(var i=0;i<employeeList.length;i++){
            if(employeeList[i].uname == uname){
                console.log('found user in db');
                if(employeeList[i].pass == pass){
                    console.log('pass match, logging in');
                    res.render('employee');
                }else{
                    //alert('incorrect password');
                    res.render('index', {data:'incorrect password'});
                }
            }else{
                //alert("user doesn't exist");
                res.render('index', {data:'user doesnt exist'});
            }
        }
    }else{
        console.log('null uname or pass');
        res.redirect('/');
    }
    /*
    console.log('render employee');
    res.render('employee');*/
});

router.get('/employer', function(req,res,next){
    //render employer view
    updateLocalDB();
    console.log('render employer');
    res.render('employer');
});

var updateLocalDB = function(){
    theDB.getAll(EmployeeModel).then(function(doc){
        //console.log(JSON.stringify(doc));
        employeeList = doc;
    });
}

module.exports = router;