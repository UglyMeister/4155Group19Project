const EmployeeModel = require('./../models/employee');
const EmployerModel = require('./../models/employer');
const GroupModel = require('./../models/group');
const SkillModel = require('./../models/skill');

exports.generateSchedule = async (req, res, next) => {
    //start building the algorithm here
    try {
        var currentSkills = req.session.currentGroup.skillIDs;
        var currentMembers = req.session.currentGroup.memberIDs;
        var x;//members
        var y;//skills
        var z;// the end product that will be returned
        for(x in currentMembers){
            for(y in currentSkills){
                //compare the time specified by the employer to the
                //availability of the employee
                //do this for all days and check whether the day is
                //enabled or not

            }
        }
    } catch (e) {
        console.log(e);
    }
}


//might not need this section, will figure it out later, for now going to
//work on the actual algorithm
exports.showScheduleMaker = async (req, res, next) => {
    try {
        if(req.session.profile) {
            //don't even know if we need this page, might be better to just run the
            //algorithm then find out whether or not the schedule can be made
            if(req.query.groupId != null){
                console.log("group ID: " + req.query.groupId);
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
}