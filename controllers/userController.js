const EmployeeModel = require('./../models/employee');
const EmployerModel = require('./../models/employer');
const GroupModel = require('./../models/group');
const SkillModel = require('./../models/skill');

exports.getProfile = async (req, res, next) => {
    try {
        if (req.session.profile) {
            req.session.groupNames = await GroupModel.find(
                { _id: { $in: req.session.profile.groupIDs } },
                { name: 1 }
            );
            console.log(req.session.groupNames);
            res.render('profile', {
                type: req.session.type,
                groups: req.session.groupNames,
                numberOfGroups: req.session.groupNames.length,
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
        const newGroup = await GroupModel.create(req.body);
        req.session.groupNames.push(newGroup);
        await EmployerModel.findByIdAndUpdate(employer._id, { $push: { groupIDs: newGroup._id } });
        res.render('profile', {
            type: req.session.type,
            groups: req.session.groupNames,
            numberOfGroups: req.session.groupNames.length,
            name: req.session.profile.name
        });
    } catch (e) {
        console.log(e);
    }
};

exports.addJob = async (req, res, next) => {
    const employee = req.session.profile;
    const joinGroup = await GroupModel.findById(req.body.groupID);
    await EmployeeModel.findByIdAndUpdate(employee._id, { $push: { groupIDs: joinGroup._id } });
    await GroupModel.findByIdAndUpdate(joinGroup._id, { $push: { memberIDs: employee._id } });
    req.session.groupNames.push(joinGroup);
    res.render('profile', {
        type: req.session.type,
        groups: req.session.groupNames,
        numberOfGroups: req.session.groupNames.length,
        name: req.session.profile.name
    });
};

exports.employeeJobPage = async (req, res, next) => {
    try {
        console.log('test');
        if (req.session.profile) {
            req.session.currentGroup = await GroupModel.findById(req.query.groupID);
            req.session.groupSkillNames = await SkillModel.find(
                { _id: { $in: req.session.currentGroup.skillIDs } },
                { name: 1 }
            );

            res.render('groupPage', {
                jobCode: req.session.currentGroup._id,
                type: req.session.type,
                employee: req.session.profile,
                skills: req.session.groupSkillNames,
                name: req.session.currentGroup.name
            });
        } else {
            res.render('index', { data: 'error, not logged in, please log in' });
        }
    } catch (e) {
        console.log(e);
    }
};

exports.employerJobPage = async (req, res, next) => {
    try {
        if (req.session.profile) {
            req.session.currentGroup = await GroupModel.findById(req.query.groupID);
            req.session.groupSkillNames = await SkillModel.find(
                { _id: { $in: req.session.currentGroup.skillIDs } },
                { name: 1 }
            );
            req.session.groupEmployeeNames = await EmployeeModel.find(
                { _id: { $in: req.session.currentGroup.memberIDs } },
                { name: 1 }
            );

            res.render('groupPage', {
                jobCode: req.session.currentGroup._id,
                type: req.session.type,
                skills: req.session.groupSkillNames,
                employees: req.session.groupEmployeeNames,
                name: req.session.currentGroup.name
            });
        } else {
            res.render('index', { data: 'error, not logged in, please log in' });
        }
    } catch (e) {
        console.log(e);
    }
};

exports.createSkill = async (req, res, next) => {
    try {
        const newSkill = await SkillModel.create(req.body);
        await GroupModel.findByIdAndUpdate(req.session.currentGroup._id, {
            $push: { skillIDs: newSkill._id }
        });
        req.session.groupSkillNames.push(newSkill);
        res.render('groupPage', {
            jobCode: req.session.currentGroup._id,
            type: req.session.type,
            skills: req.session.groupSkillNames,
            employees: req.session.groupEmployeeNames,
            name: req.session.currentGroup.name
        });
    } catch (e) {
        console.log(e);
    }
};

exports.employeeUpdateSkill = async (req, res, next) => {
    if (req.query.skillUpdate == 'add') {
        await EmployeeModel.findByIdAndUpdate(req.session.profile._id, {
            $push: { skillIDs: req.query.skillID }
        });
    } else {
        await EmployeeModel.findByIdAndUpdate(req.session.profile._id, {
            $pull: { skillIDs: req.query.skillID }
        });
    }

    req.session.profile = await EmployeeModel.findById(req.session.profile._id);

    res.render('groupPage', {
        jobCode: req.session.currentGroup._id,
        type: req.session.type,
        employee: req.session.profile,
        skills: req.session.groupSkillNames,
        name: req.session.currentGroup.name
    });
};
