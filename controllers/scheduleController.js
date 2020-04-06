const EmployeeModel = require('./../models/employee');
const EmployerModel = require('./../models/employer');
const GroupModel = require('./../models/group');
const SkillModel = require('./../models/skill');

/*var x; //members*/
//var y; //skills
//var z; // the end product that will be returned
//for (x in currentMembers) {
//for (y in currentSkills) {
////compare the time specified by the employer to the
////availability of the employee
////do this for all days and check whether the day is
////enabled or not
//}
/*}*/
exports.generateSchedule = async (req, res, next) => {
    //start building the algorithm here
    try {
        const days = ['mon', 'tues', 'wed', 'th', 'fri', 'satur', 'sun'];
        var currentSkills = req.session.currentGroup.skillIDs;
        var currentMembers = req.session.currentGroup.memberIDs;

        async function daySchedule(day) {
            var employeeDay = [];
            const dayShift = day + 'Shift';
            const dayAvail = day + 'Avail';
            for (const skill in currentSkills) {
                console.log(skill[dayShift[0]]);
                employeeDay.push(
                    await EmployeeModel.find({
                        $and: [
                            { _id: { $in: skill.userIDs } },
                            { [dayAvail[0]]: { $gte: skill[dayShift[0]] - 2 } },
                            { [dayAvail[0]]: { $lte: skill[dayShift[0]] + 2 } },
                            { [dayAvail[2]]: { $eq: skill[dayShift[2]] } },
                            { [dayAvail[3]]: { $gte: skill[dayShift[3]] - 2 } },
                            { [dayAvail[3]]: { $lte: skill[dayShift[3]] + 2 } },
                            { [dayAvail[5]]: { $eq: skill[dayShift[5]] } }
                        ]
                    })
                );
            }
            return employeeDay;
        }

        const monSchedule = daySchedule(days[0]);
        const tueSchedule = daySchedule(days[1]);
        const wedSchedule = daySchedule(days[2]);
        const thSchedule = daySchedule(days[3]);
        const friSchedule = daySchedule(days[4]);
        const satSchedule = daySchedule(days[5]);
        const sunSchedule = daySchedule(days[6]);
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

