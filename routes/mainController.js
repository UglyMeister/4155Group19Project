var express = require('express');
var router = express.Router();

//var mysql = require('mysql');

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

router.get('/index', function(req, res, next){
    //render homepage
    console.log('render index');
    res.render('index');
});

router.get('/help', function(req, res, next){
    //render help page
    console.log('render help');
    res.render('help');
});

module.exports = router;