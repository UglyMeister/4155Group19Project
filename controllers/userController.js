const EmployeeModel = require('./../models/employee');
const EmployerModel = require('./../models/employer');
const groupModel = require('./../models/group');

exports.getProfile = async (req, res, next) => {
    try {
        if (req.session.profile) {
            //find all groups by id and put names here
            const groups = null;
            const numberOfGroups = 0;
            res.render('profile', {
                type: req.session.type,
                groups: groups,
                numberOfGroups: numberOfGroups,
                name: req.session.profile.name
            }); //this is temporary, will change later
        } else {
            res.render('index', { data: 'error, not logged in, please log in' });
        }
    } catch (e) {
        console.log(e);
    }
};

exports.createJob = async (req, res, next) => {
    try {
        req.body.ownerId = req.session.profile._id;
        const newGroup = await groupModel.create(req.body);
        res.redirect('/employer/profile');
    } catch (e) {
        console.log(e);
    }
};
