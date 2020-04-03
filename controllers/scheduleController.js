const EmployeeModel = require('./../models/employee');
const EmployerModel = require('./../models/employer');
const GroupModel = require('./../models/group');
const SkillModel = require('./../models/skill');

exports.generateSchedule = async (req, res, next) => {
    //start building the algorithm here
    try {

    } catch (e) {
        console.log(e);
    }
}

exports.showScheduleMaker = async (req, res, next) => {
    try {
        if(req.session.profile) {
            //need to display the page with the different skills as selectable options
            res.render('employer');
        }
    } catch (e) {
        console.log(e);
    }
}