const EmployeeModel = require('./../models/employee');
const EmployerModel = require('./../models/employer');
const groupModel = require('./../models/group');
const SkillModel = require('./../models/skill');

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

exports.addJob = async (req, res, next) => {
    const employee = req.session.profile;
    const joinGroup = await groupModel.findById(req.body.groupId);
    await EmployeeModel.findByIdAndUpdate(employee._id, { $push: { groupIDs: joinGroup._id } });
    await groupModel.findByIdAndUpdate(joinGroup._id, { $push: { memberIds: employee._id } });
    res.redirect('/employee/profile');
};

exports.jobPage = async (req, res, next) => {
    try {
        if (req.session.profile) {
            const group = await groupModel.findById(req.body.groupId);
            const skillNames = await SkillModel.find({ _id: { $in: group.skillIds } }, { name: 1 });
            const employeeNames = await EmployeeModel.find(
                { _id: { $in: group.memberIds } },
                { name: 1 }
            );

            res.render('groupPage', {
                jobCode: req.body.groupId,
                type: req.session.type,
                skills: skillNames,
                employees: employeeNames,
                name: group.groupName
            });
        } else {
            res.render('index', { data: 'error, not logged in, please log in' });
        }
    } catch (e) {
        console.log(e);
    }
};
