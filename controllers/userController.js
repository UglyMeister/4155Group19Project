const EmployeeModel = require('./../models/employee');
const EmployerModel = require('./../models/employer');
const GroupModel = require('./../models/group');
const SkillModel = require('./../models/skill');
const nodemailer = require('nodemailer');

exports.getProfile = async (req, res, next) => {
    try {
        if (req.session.profile) {
            req.session.groupNames = await GroupModel.find(
                { _id: { $in: req.session.profile.groupIDs } },
                { name: 1 }
            );
            req.session.save();
            res.render('profile', {
                type: req.session.type,
                groups: req.session.groupNames,
                numberOfGroups: req.session.groupNames.length,
                name: req.session.profile.name,
                loggedIn: req.session.loggedIn
            });
        } else {
            res.render('index', {
                data: 'error, not logged in, please log in',
                loggedIn: req.session.loggedIn
            });
        }
    } catch (e) {
        console.log(e);
    }
};

exports.createJob = async (req, res, next) => {
    try {
        if (req.body != null && req.body.name.trim() != '') {
            const employer = req.session.profile;
            req.body.ownerID = employer._id;
            const newGroup = await GroupModel.create(req.body);
            req.session.groupNames.push(newGroup);
            await EmployerModel.findByIdAndUpdate(employer._id, {
                $push: { groupIDs: newGroup._id }
            });
            req.session.save();
            res.render('profile', {
                type: req.session.type,
                groups: req.session.groupNames,
                numberOfGroups: req.session.groupNames.length,
                name: req.session.profile.name,
                loggedIn: req.session.loggedIn
            });
        } else {
            throw new Error('Non null non empty name needed');
        }
    } catch (e) {
        console.log(e);
        res.render('profile', {
            type: req.session.type,
            groups: req.session.groupNames,
            numberOfGroups: req.session.groupNames.length,
            name: req.session.profile.name,
            loggedIn: req.session.loggedIn,
            message: 'Please enter a job name!'
        });
    }
};

exports.addJob = async (req, res, next) => {
    try {
        if (req.body != null && req.body.groupID.trim() != '') {
            const employee = req.session.profile;
            const joinGroup = await GroupModel.findById(req.body.groupID);
            await EmployeeModel.findByIdAndUpdate(employee._id, {
                $push: { groupIDs: joinGroup._id }
            });
            await GroupModel.findByIdAndUpdate(joinGroup._id, {
                $push: { memberIDs: employee._id }
            });
            req.session.groupNames.push(joinGroup);
            req.session.save();
            res.render('profile', {
                type: req.session.type,
                groups: req.session.groupNames,
                numberOfGroups: req.session.groupNames.length,
                name: req.session.profile.name,
                loggedIn: req.session.loggedIn
            });
        } else {
            throw new Error('Null or Empty');
        }
    } catch (e) {
        console.log(e);
        res.render('profile', {
            type: req.session.type,
            groups: req.session.groupNames,
            numberOfGroups: req.session.groupNames.length,
            name: req.session.profile.name,
            loggedIn: req.session.loggedIn,
            message: 'Please enter a valid group id'
        });
    }
};

exports.employeeJobPage = async (req, res, next) => {
    try {
        if (req.session.profile) {
            if (req.query != null) {
                req.session.currentGroup = await GroupModel.findById(req.query.groupID);
            }
            req.session.groupSkillNames = await SkillModel.find({
                _id: { $in: req.session.currentGroup.skillIDs }
            });

            req.session.profile = await EmployeeModel.findById(req.session.profile._id);

            req.session.save();
            res.render('groupPage', {
                jobCode: req.session.currentGroup._id,
                type: req.session.type,
                employee: req.session.profile,
                skills: req.session.groupSkillNames,
                name: req.session.currentGroup.name,
                loggedIn: req.session.loggedIn
            });
        } else {
            res.render('index', {
                data: 'error, not logged in, please log in',
                loggedIn: req.session.loggedIn
            });
        }
    } catch (e) {
        console.log(e);
    }
};

exports.employerJobPage = async (req, res, next) => {
    try {
        if (req.session.profile) {
            if (req.query.groupID != null) {
                req.session.currentGroup = await GroupModel.findById(req.query.groupID);
            }
            req.session.groupSkillNames = await SkillModel.find({
                _id: { $in: req.session.currentGroup.skillIDs }
            });
            req.session.groupEmployeeNames = await EmployeeModel.find(
                { _id: { $in: req.session.currentGroup.memberIDs } },
                { name: 1 }
            );

            req.session.save();
            res.render('groupPage', {
                jobCode: req.session.currentGroup._id,
                type: req.session.type,
                skills: req.session.groupSkillNames,
                employees: req.session.groupEmployeeNames,
                name: req.session.currentGroup.name,
                loggedIn: req.session.loggedIn
            });
        } else {
            res.render('index', {
                data: 'error, not logged in, please log in',
                loggedIn: req.session.loggedIn
            });
        }
    } catch (e) {
        console.log(e);
    }
};

exports.createSkill = async (req, res, next) => {
    try {
        if (req.body != null && req.body.name.trim() != '') {
            const newSkill = await SkillModel.create(req.body);
            await GroupModel.findByIdAndUpdate(req.session.currentGroup._id, {
                $push: { skillIDs: newSkill._id }
            });
            req.session.groupSkillNames.push(newSkill);
            req.session.save();
            res.render('groupPage', {
                jobCode: req.session.currentGroup._id,
                type: req.session.type,
                skills: req.session.groupSkillNames,
                employees: req.session.groupEmployeeNames,
                name: req.session.currentGroup.name,
                loggedIn: req.session.loggedIn
            });
        } else {
            throw new Error('Need a non null non empty skill name');
        }
    } catch (e) {
        console.log(e);
        res.render('groupPage', {
            jobCode: req.session.currentGroup._id,
            type: req.session.type,
            skills: req.session.groupSkillNames,
            employees: req.session.groupEmployeeNames,
            name: req.session.currentGroup.name,
            loggedIn: req.session.loggedIn,
            message: 'Your skill needs a name'
        });
    }
};

function mail(message, employer, subjectEmail) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'smartboss10837@gmail.com',
                pass: 'g9ERHTxCy8rHTJT'
            }
        });
        console.log(transporter.options.host);

        let mailOptions = {
            from: 'smartboss10837@gmail.com',
            to: employer.email,
            subject: subjectEmail,
            text: message
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (e) {
        console.log(e);
    }
}

//needs fixing using a patch through employee group page
exports.employeeUpdateSkill = async (req, res, next) => {
    try {
        let message;
        if (req.query.skillUpdate == 'add') {
            await EmployeeModel.findByIdAndUpdate(req.session.profile._id, {
                $push: { skillIDs: req.query.skillID }
            });
            const skill = await SkillModel.findByIdAndUpdate(req.query.skillID, {
                $push: { userIDs: req.session.profile._id }
            });
            message = `Please check ${req.session.profile.name} they have added ${skill.name} from their skill set`;
        } else {
            await EmployeeModel.findByIdAndUpdate(req.session.profile._id, {
                $pull: { skillIDs: req.query.skillID }
            });
            const skill = await SkillModel.findByIdAndUpdate(req.query.skillID, {
                $pull: { userIDs: req.session.profile._id }
            });
            message = `Please check ${req.session.profile.name} they have removed ${skill.name} from their skill set`;
        }

        req.session.profile = await EmployeeModel.findById(req.session.profile._id);

        const groupOwner = await EmployerModel.findById(req.session.currentGroup.ownerID);
        mail(message, groupOwner, `${req.session.profile.name} Skill Change`);

        req.session.save();
        res.render('groupPage', {
            jobCode: req.session.currentGroup._id,
            type: req.session.type,
            employee: req.session.profile,
            skills: req.session.groupSkillNames,
            name: req.session.currentGroup.name,
            loggedIn: req.session.loggedIn
        });
    } catch (e) {
        console.log(e);
    }
};

//need to work on doing calculations client side and sending a patch request
//also work on making it impossible to enter in a larger number to start then end
exports.updateAvailability = async (req, res, next) => {
    try {
        const test = await EmployeeModel.findByIdAndUpdate(req.session.profile._id, req.body);
        const employer = await EmployerModel.findById(req.session.currentGroup.ownerID);
        mail(
            `Please check ${req.session.profile.name} they have updated their availability`,
            employer,
            `${req.session.profile.name} Availability Change`
        );
        res.status(200).json({
            status: 'success',
            message: req.session.currentGroup._id,
            data: req.session
        });
    } catch (e) {
        console.log(e);
    }
};

//need to work on getting delete request made
exports.deleteSkillPage = async (req, res) => {
    try {
        await GroupModel.findByIdAndUpdate(req.session.currentGroup._id, {
            $pull: { skillIDs: req.body.skillID }
        });
        await EmployeeModel.updateMany(
            {
                $and: [
                    { _id: { $in: req.session.groupEmployeeNames._id } },
                    { skillIDs: req.body.skillID }
                ]
            },
            { $pull: { skillIDs: req.body.skillID } }
        );
        removeSkill = await SkillModel.findByIdAndDelete(req.body.skillID);
        req.session.groupSkillNames.splice(req.session.groupSkillNames.indexOf(removeSkill));

        req.session.save();
        res.render('groupPage', {
            jobCode: req.session.currentGroup._id,
            type: req.session.type,
            skills: req.session.groupSkillNames,
            employees: req.session.groupEmployeeNames,
            name: req.session.currentGroup.name,
            loggedIn: req.session.loggedIn
        });
    } catch (e) {
        console.log(e);
    }
};

exports.getUpdateSkillPage = async (req, res) => {
    try {
        req.session.currentSkill = await SkillModel.findById(req.query.skillID);
        if (req.session.currentSkill == null) {
            res.render('groupPage', {
                jobCode: req.session.currentGroup._id,
                type: req.session.type,
                skills: req.session.groupSkillNames,
                employees: req.session.groupEmployeeNames,
                name: req.session.currentGroup.name,
                loggedIn: req.session.loggedIn,
                message: 'cannot find this skill'
            });
        }
        req.session.save();
        res.render('skillPage', {
            loggedIn: req.session.loggedIn,
            jobCode: req.session.currentGroup._id,
            skill: req.session.currentSkill
        });
    } catch (e) {
        console.log(e);
    }
};

exports.updateSkillPage = async (req, res) => {
    try {
        const test = await SkillModel.findByIdAndUpdate(req.session.currentSkill._id, req.body);
        res.status(200).json({
            status: 'success',
            data: {
                jobCode: req.session.currentGroup._id,
                type: req.session.type,
                skills: req.session.groupSkillNames,
                employees: req.session.groupEmployeeNames,
                name: req.session.currentGroup.name
            }
        });
    } catch (e) {
        console.log(e);
    }
};
