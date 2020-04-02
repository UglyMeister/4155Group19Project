const EmployeeModel = require('./../models/employee');

exports.getProfile = async (req, res, next) => {
    try {
        console.log(req.session.profile);
        if (req.session.profile) {
            console.log('render profile');
            res.render('profile', { data: req.session.profile.name, loggedIn: req.session.loggedIn }); //this is temporary, will change later
        } else {
            res.render('index', { data: 'error, not logged in, please log in', loggedIn: req.session.loggedIn });
        }
    } catch (e) {
        console.log(e);
    }
};
