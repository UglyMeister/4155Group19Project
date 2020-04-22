const express = require('express');

const homeController = require('./../controllers/homeController');
//below line is for testing only, not production
const scheduleController = require('./../controllers/scheduleController');

const router = express.Router();

router.get('/', function (req, res, next) {
    //render homepage
    if (req.session && req.session.loggedIn == false) {
        console.log('render index');
        res.render('index', { data: '', loggedIn: req.session.loggedIn });
    } else if (req.session && req.session.loggedIn == true) {
        if (req.session.type == 'employee') {
            res.redirect('/employee/');
        } else if (req.session.type == 'employer') {
            res.redirect('/employer');
        }
    } else {
        req.session.loggedIn = false;
        res.render('index', { data: '', loggedIn: req.session.loggedIn });
    }
});

router.get('/help', function (req, res, next) {
    //render help page
    console.log('render help');
    //if(){} NEED TO ADD LOGIC HERE TO CHECK SESSION TO SEE IF SOMEONE IS LOGGED IN OR NOT
    res.render('help', { loggedIn: req.session.loggedIn });
});

router.route('/login').post(homeController.userLogin);

router.get('/about', function (req, res, next) {
    //render about page
    console.log('render about');
    //if(){} NEED TO ADD LOGIC HERE TO CHECK SESSION TO SEE IF SOMEONE IS LOGGED IN OR NOT
    res.render('about', { loggedIn: req.session.loggedIn });
});

router
    .route('/signup')
    .get(function (req, res, next) {
        //render signup page
        console.log('render signup');
        res.render('signup', { data: '', loggedIn: req.session.loggedIn });
    })
    .post(homeController.createUser);

router.get('/logout', function (req, res, next) {
    console.log('delete user from session');
    req.session.destroy();
    console.log('redirect to index');
    res.redirect('/');
});

module.exports = router;
