const EmployeeModel = require('./../models/employee');

exports.getProfile = async (req, res, next) => {
    try {
        console.log(req.session.profile);
        if (req.session.profile) {
            console.log('render profile');
            res.render('profile', { data: req.session.profile.name }); //this is temporary, will change later
        } else {
            res.render('index', { data: 'error, not logged in, please log in' });
        }
    } catch (e) {
        console.log(e);
    }
};

