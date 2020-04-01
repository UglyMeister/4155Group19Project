const express = require('express');

const homeController = require('./../controllers/homeController');

const router = express.Router();

router.get('/', function (req, res, next) {
    //render homepage
    console.log('render index');
    res.render('index', { data: '', loggedIn: false });
});

router.get('/help', function (req, res, next) {
    //render help page
    console.log('render help');
    //if(){} NEED TO ADD LOGIC HERE TO CHECK SESSION TO SEE IF SOMEONE IS LOGGED IN OR NOT
    res.render('help');
});

router.route('/login').post(homeController.userLogin);

router.get('/about', function (req, res, next) {
    //render about page
    console.log('render about');
    //if(){} NEED TO ADD LOGIC HERE TO CHECK SESSION TO SEE IF SOMEONE IS LOGGED IN OR NOT
    res.render('about');
});

router
    .route('/signup')
    .get(function (req, res, next) {
        //render signup page
        console.log('render signup');
        res.render('signup', { data: '', loggedIn: false });
    })
    .post(homeController.createUser);

module.exports = router;
