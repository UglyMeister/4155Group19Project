const EmployeeModel = require('./../models/employee');
const EmployerModel = require('./../models/employer');
const groupModel = require('./../models/group');

exports.getProfile = async (req, res, next) => {
    try {
        if (req.session.profile) {
            const groupNames = await groupModel.find(
                { _id: { $in: req.session.profile.groupIDs } },
                { groupName: 1 }
            );
            const numberOfGroups = groupNames.length;

            res.render('profile', {
                type: req.session.type,
                groups: groupNames,
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
        const employer = req.session.profile;
        req.body.ownerId = employer._id;
        const newGroup = await groupModel.create(req.body);
        await EmployerModel.findByIdAndUpdate(employer._id, { $push: { groupIDs: newGroup._id } });
        res.redirect('/employer/profile');
    } catch (e) {
        console.log(e);
    }
};

exports.getGroups = async (req, res, next) => {
    const employer = req.session.profile;
};

exports.jobPage = async (req, res, next) => {
    res.render('groupPage');
};
