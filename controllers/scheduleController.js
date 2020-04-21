const EmployeeModel = require('./../models/employee');
const EmployerModel = require('./../models/employer');
const GroupModel = require('./../models/group');
const SkillModel = require('./../models/skill');
const xlsx = require('xlsx');
const fs = require('fs');
const tempfile = require('tempfile');

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
                employeeDay.push(skill);
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

        req.session.schedule = [];

        for (var i = 0; i < 7; i++) {
            req.session.schedule.push(await daySchedule(days[i]));
        }

        req.session.save();

        res.render('schedule', {
            schedule: req.session.schedule,
            skills: req.session.groupSkillNames,
            employees: req.session.groupEmployeeNames,
            loggedIn: req.session.loggedIn,
            day: 0
        });
    } catch (e) {
        console.log(e);
    }
};

async function dayScheduleFormat(schedule) {
    const length = schedule.length;
    var day = [];
    for (var i = 0; i < length; i += 2) {
        var skillandUser = [];
        var test = `skillEmployee[${i}]`;
        skillandUser.push(schedule[test]);
        var test = `skillEmployee[${i + 1}]`;
        skillandUser.push(schedule[test]);
        day.push(skillandUser);
    }
    return day;
}

exports.scheduleHandler = async (req, res, next) => {
    if (req.body.day == 0) {
        req.session.finalizedSchedule = null;
        req.session.finalizedSchedule = [];
    }
    const day = parseInt(req.body.day) + 1;
    req.session.finalizedSchedule.push(await dayScheduleFormat(req.body));
    req.session.save();

    if (day < 7) {
        res.render('schedule', {
            schedule: req.session.schedule,
            skills: req.session.groupSkillNames,
            employees: req.session.groupEmployeeNames,
            loggedIn: req.session.loggedIn,
            day: day
        });
    } else {
        createSchedule(req);
    }
};

async function createSchedule(req) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var wb = xlsx.utils.book_new();
    wb.Props = {
        Title: `Schedule for ${req.session.currentGroup.name}`,
        Subject: 'Daily Schedules',
        Author: `${req.session.profile.name} and powered by SmartBoss`
        //CreatedDate: new Date()
    };
    for (var i = 0; i < 7; i++) {
        const daySchedule = req.session.finalizedSchedule[i];
        var data = [];
        for (const item in daySchedule) {
            data.push(daySchedule[item]);
        }
        console.log(data);
        var ws = xlsx.utils.aoa_to_sheet(data);
        ws['!cols'] = [{ wch: 30 }, { wch: 30 }];
        xlsx.utils.book_append_sheet(wb, ws, days[i]);
    }
    xlsx.writeFile(wb, 'Schedule.xlsx');
    //const wbook = xlsx.write(wb, {booktype:'xlsx', type: 'binary'})
}
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

exports.createExcel = async (req, res, next) => {
    try {
        //this is some test code to see how i could do sharing of the workbook
        //https://www.youtube.com/watch?v=tKz_ryychBY
        var wb = xlsx.utils.book_new();
        wb.Props = {
            Title: 'Learning how to use sheetjs',
            Subject: 'Test file',
            Author: 'UglyMeister',
            CreatedDate: new Date(2020, 4, 19)
        };
        wb.SheetNames.push('Test Sheet');
        var data = [['something', 'else']];
        var ws = xlsx.utils.aoa_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Test');

        xlsx.writeFile(wb, 'TestExcel.xlsx');
        res.render('index', { data: '', loggedIn: req.session.loggedIn });
        //var wbout = xlsx.writeFile(wb, {bookType:'xlsx', type:'file'});

        //this is the end of the test code
    } catch (e) {
        console.log(e);
    }
};

//found this function on the sheetjs docs, supposed to open a stream using filesystem that we can use to write to
//may or may not use this, still trying to decide
function process_RS(stream, cb) {
    var fname = tempfile('.sheetjs');
    console.log(fname);
    var ostream = fs.createWriteStream(fname);
    stream.pipe(ostream);
    ostream.on('finish', function () {
        var workbook = xlsx.readFile(fname);
        fs.unlinkSync(fname);
        //could do something here
        cb(workbook);
    });
}
