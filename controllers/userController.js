const EmployeeModel = require('./../models/employee');

exports.getProfile = async (req, res, next) => {
    try {
        if (req.session.profile) {
            //find all groups by id and put names here
            const groups = null;
            const numberOfGroups = 0;
            res.render('profile', {
                type: req.session.type,
                groups: groups,
                numberOfGroups: numberOfGroups
            }); //this is temporary, will change later
        } else {
            res.render('index', { data: 'error, not logged in, please log in' });
        }
    } catch (e) {
        console.log(e);
    }
};
