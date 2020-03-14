var express = require('express');
var router = express.Router();

var theDB = require('../util/db');
var employeeList;
var employerList;
var skillsList;
var groupsList;

var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true
});
var db = mongoose.connection;

var employeeSchema = new mongoose.Schema(
    {
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
    },
    { collection: 'employee' }
);

var employerSchema = new mongoose.Schema(
    {
        name: String,
        id: Number,
        email: String,
        uname: {
            type: String,
            unique: true
        },
        pass: String,
        groupIDs: []
    },
    { collection: 'employer' }
);

var skillsSchema = new mongoose.Schema(
    {
        groupID: Number,
        userID: Number,
        skills: []
    },
    { collection: 'skills' }
);

var groupsSchema = new mongoose.Schema(
    {
        groupID: Number,
        ownerID: Number,
        memberIDs: [],
        skills: []
    },
    { collection: 'groups' }
);

var EmployeeModel = db.model('Employee', employeeSchema);
var EmployerModel = db.model('Employer', employerSchema);
var SkillsModel = db.model('Skills', skillsSchema);
var GroupsModel = db.model('Groups', groupsSchema);

//var mysql = require('mysql');

db.once('open', function() {
    console.log('Connected to database');
    //test
    //can comment the below statement out later, this proves that the db
    //can be accessed and data can be pulled from it
    updateLocalDB();
    /*
    theDB.getAll(EmployeeModel).then(function(doc){
        console.log(JSON.stringify(doc));
        employeeList = doc;
    });
    theDB.getAll(EmployerModel).then(function(doc){
        employerList = doc;
    });
    theDB.getAll(SkillsModel).then(function(doc){
        skillsList = doc;
    });
    theDB.getAll(GroupsModel).then(function(doc){
        groupsList = doc;
    });
    */
});

var viewAddress;
var viewData;

router.get('/*', function(req, res, next) {
    console.log('checking session');
    let sessionProfile = req.session.currentProfile;

    if (typeof sessionProfile != 'undefined') {
        res.locals.theUser = req.session.theUser;
    }
    next();
});

router.get('/', function(req, res, next) {
    //render homepage
    updateLocalDB();
    console.log('render index');
    res.render('index', { data: '' });
});

router.get('/help', function(req, res, next) {
    //render help page
    updateLocalDB();
    console.log('render help');
    res.render('help');
});

router.get('/about', function(req, res, next) {
    //render about page
    updateLocalDB();
    console.log('render about');
    res.render('about');
});

router.get('/employee', function(req, res, next) {
    //render employee view
    updateLocalDB();
    var uname;
    var pass;
    console.log('uname');
    console.log(req.query.uname);
    console.log('pass');
    console.log(req.query.pass);
    if (req.query.uname != null && req.query.pass != null) {
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
        for (var i = 0; i < employeeList.length; i++) {
            if (employeeList[i].uname == uname) {
                console.log('found user in db');
                if (employeeList[i].pass == pass) {
                    console.log('pass match, logging in');
                    res.render('employee');
                } else {
                    //alert('incorrect password');
                    res.render('index', { data: 'incorrect password' });
                }
            } else {
                //alert("user doesn't exist");
                res.render('index', { data: 'user doesnt exist' });
            }
        }
    } else {
        console.log('null uname or pass');
        res.redirect('/');
    }
    /*
    console.log('render employee');
    res.render('employee');*/
});

router.get('/employer', function(req, res, next) {
    //render employer view
    updateLocalDB();
    var uname = req.query.uname;
    var pass = req.query.pass;
    console.log(`uname: ${uname}`);
    console.log(`pass: ${pass}`);
    if (uname != null && pass != null) {
        for (const i in employerList) {
            if (i.uname === uname) {
                console.log('found user in db');
                if (i.pass === pass) {
                    console.log('pass match logging in');
                    res.render('employer');
                } else {
                    res.render('index', { data: 'incorrect password' });
                }
            } else {
                res.render('index', { data: 'user does not exist' });
            }
        }
    } else {
        console.log('null name or pass');
        res.redirect('/');
    }
});

router.get('/signup', function(req, res, next) {
    //render signup page
    updateLocalDB();
    console.log('render signup');
    res.render('signup', { data: '' });
});

router.get('/createnewuser', function(req, res, next) {
    //create a new user
    var check = false;
    if (req.query.signupcheck == 'employee') {
        console.log('employee signup');
        for (var i = 0; i < employeeList.length; i++) {
            if (
                req.query.uname == employeeList[i].uname ||
                req.query.email == employeeList[i].email
            ) {
                console.log('already in use uname/email');
                res.render('/signup', {
                    data:
                        'a user with that username/email already exists, please enter a new username'
                });
            } else {
                console.log('new user confirmed');
                var newUser = new EmployeeModel({
                    name: req.query.name,
                    id: i + 1,
                    email: req.query.email,
                    uname: req.query.uname,
                    pass: req.query.pass,
                    groupIDs: [],
                    monAvail: [],
                    tueAvail: [],
                    wedAvail: [],
                    thAvail: [],
                    friAvail: [],
                    satAvail: [],
                    sunAvail: []
                });
                theDB.addNewUser(newUser).then(function() {
                    updateLocalDB();
                    console.log('new user added');
                    res.render('/');
                });
            }
        }
    }
    if (req.query.signupcheck === 'employer') {
        console.log('employee signup');
        for (const i in employerList) {
            if (req.query.uname == i.uname || req.query.email == i.email) {
                console.log('already in use uname/email');
                res.render('/signup', {
                    data:
                        'a user with that username/email already exists, please enter a new username'
                });
                check = true;
            }
        }
        if (!check) {
            console.log('new user confirmed');
            var newUser = new EmployeeModel({
                name: req.query.name,
                id: i + 1,
                email: req.query.email,
                uname: req.query.uname,
                pass: req.query.pass,
                groupIDs: []
            });
            theDB.addNewUser(newUser).then(function() {
                updateLocalDB();
                console.log('new user added');
                res.render('/');
            });
        }
    }
    updateLocalDB();
    console.log('render something');
    res.render('signup', { data: 'something went wrong' });
});

var updateLocalDB = function() {
    theDB.getAll(EmployeeModel).then(function(doc) {
        employeeList = doc;
    });
    theDB.getAll(EmployerModel).then(function(doc) {
        employerList = doc;
    });
    theDB.getAll(SkillsModel).then(function(doc) {
        skillsList = doc;
    });
    theDB.getAll(GroupsModel).then(function(doc) {
        groupsList = doc;
    });
};

module.exports = router;

