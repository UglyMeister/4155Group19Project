const express = require('express');

const homeController = require('./../controllers/homeController');

const router = express.Router();

router.get('/', function(req, res, next) {
    //render homepage
    console.log('render index');
    res.render('index', { data: '' });
});

router.get('/help', function(req, res, next) {
    //render help page
    console.log('render help');
    res.render('help');
});

router.route('/login').post(homeController.userLogin);

router.get('/about', function(req, res, next) {
    //render about page
    console.log('render about');
    res.render('about');
});

router.get('/signup', function(req, res, next) {
    //render signup page
    console.log('render signup');
    res.render('signup', { data: '' });
});

router.get('/profile', function(req,res,next) {
    //render the profile view for a user
    console.log(req.session.profile);
    if(req.session.profile){
        console.log('render profile');
        res.render('profile', {data: req.session.profile.name});//this is temporary, will change later
    } else {
        res.render('index', {data: 'error, not logged in, please log in'});
    }
});

router.route('/createnewuser').post(homeController.createUser);
module.exports = router;
