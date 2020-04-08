const EmployeeModel = require('./../models/employee');
const EmployerModel = require('./../models/employer');
const GroupModel = require('./../models/group');
const SkillModel = require('./../models/skill');

//THIS IS JUST FOR TESTING
exports.showPage = async (req, res, next) => {
    const groupID = req.session.currentGroup._id;
    var currentEmployees = await EmployeeModel.find({ groupIDs: groupID });
    console.log(currentEmployees[0].name);

    res.render('schedule', { loggedIn: req.session.loggedIn, employeeList: currentEmployees });
};

exports.generateSchedule = async (req, res, next) => {
    //start building the algorithm here
    try {
        const days = ['mon', 'tue', 'wed', 'th', 'fri', 'sat', 'sun'];
        var currentSkills = req.session.currentGroup.skillIDs;
        var currentMembers = req.session.currentGroup.memberIDs;

        async function daySchedule(day) {
            var currentSkills = req.session.currentGroup.skillIDs;
            var employeeDay = [];
            const dayShift = day + 'Shift';
            const dayAvail = day + 'Avail';
            for (var skillID in currentSkills) {
                const skill = await SkillModel.findById(currentSkills[skillID]);
                const employeeStart = [dayAvail] + '.0';
                const employeeEnd = [dayAvail] + '.1';
                const skillStart = skill[dayShift][0];
                const skillEnd = skill[dayShift][1];
                employeeDay.push(
                    await EmployeeModel.find({
                        $and: [
                            { _id: { $in: skill.userIDs } },
                            {
                                [employeeStart]: { $lte: skillStart }
                            },
                            {
                                [employeeEnd]: {
                                    $gte: skillEnd
                                }
                            }
                        ]
                    })
                );
            }
            return employeeDay;
        }
        const monSchedule = await daySchedule(days[0]);
        const tueSchedule = await daySchedule(days[1]);
        const wedSchedule = await daySchedule(days[2]);
        const thSchedule = await daySchedule(days[3]);
        const friSchedule = await daySchedule(days[4]);
        const satSchedule = await daySchedule(days[5]);
        const sunSchedule = await daySchedule(days[6]);
        console.log(monSchedule);
    } catch (e) {
        console.log(e);
    }
};

//might not need this section, will figure it out later, for now going to
//work on the actual algorithm
exports.showScheduleMaker = async (req, res, next) => {
    try {
        if (req.session.profile) {
            //don't even know if we need this page, might be better to just run the
            //algorithm then find out whether or not the schedule can be made
            if (req.query.groupId != null) {
                console.log('group ID: ' + req.query.groupId);
                req.session.currentGroup = await GroupModel.findById(req.query.groupID);
            }
            req.session.groupSkillNames = await SkillModel.find(
                { _id: { $in: req.session.currentGroup.skillIDs } },
                { name: 1 }
            );
            //NOT SURE YET IF THE ABOVE CODE IS NECESSARY, NEED TO DO MORE THINKING
            res.render('employer');
        }
    } catch (e) {
        console.log(e);
    }
};
