const EmployeeModel = require('./../models/employee');
const EmployerModel = require('./../models/employer');
const GroupModel = require('./../models/group');
const SkillModel = require('./../models/skill');
const xlsx = require('xlsx');
const fs = require('fs');
const tempfile = require('tempfile');

exports.generateSchedule = async (req, res, next) => {
    //start building the algorithm here
    try {
        const days = ['mon', 'tue', 'wed', 'th', 'fri', 'sat', 'sun'];

        async function daySchedule(day) {
            var currentSkills = req.session.currentGroup.skillIDs;
            var employeeDay = [];
            const dayShift = day + 'Shift';
            const dayAvail = day + 'Avail';
            req.session.skillStart = [];
            req.session.skillEnd = [];
            for (var skillID in currentSkills) {
                const skill = await SkillModel.findById(currentSkills[skillID]);
                const employeeStart = [dayAvail] + '.0';
                const employeeEnd = [dayAvail] + '.1';
                const skillStart = skill[dayShift][0];
                const skillEnd = skill[dayShift][1];
                req.session.skillStart.push(skillStart);
                req.session.skillEnd.push(skillEnd);
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
                employeeDay.push(timeFormat(skillStart));
                employeeDay.push(timeFormat(skillEnd));
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
    //var startEnd;
    //day.push();
    var temp = [['Skill'], ['Employee Name'], ['Start Time'], ['End Time']];
    day.push(temp);
    for (var i = 0; i < length; i += 4) {
        var skillandUser = [];
        var test = `skillEmployee[${i}]`;
        skillandUser.push(schedule[test]);
        var test = `skillEmployee[${i + 1}]`;
        skillandUser.push(schedule[test]);
        test = `skillEmployee[${i + 2}]`;
        skillandUser.push(schedule[test]);
        test = `skillEmployee[${i + 3}]`;
        skillandUser.push(schedule[test]);
        day.push(skillandUser);
    }
    return day;
}

exports.scheduleHandler = async (req, res, next) => {
    var check = false;
    if (req.body.day == 0) {
        req.session.finalizedSchedule = null;
        req.session.finalizedSchedule = [];
    }
    const day = parseInt(req.body.day) + 1;
    req.session.finalizedSchedule.push(await dayScheduleFormat(req.body));
    req.session.save();

    if (day < 1) {
        res.render('schedule', {
            schedule: req.session.schedule,
            skills: req.session.groupSkillNames,
            employees: req.session.groupEmployeeNames,
            loggedIn: req.session.loggedIn,
            day: day
        });
    } else {
        check = createSchedule(req);
        res.redirect('/');
    }

    //this is just my dumb way of trying to redirect while giving the program enough time to finish adding the entries to the file
    /*
    if(check){
        setTimeout(function(){
            res.redirect('/');
        }, 6000);
    }*/
};

function timeFormat(time) {
    var half = 'am';
    if (time >= 1200) {
        time = time - 1200;
        half = 'pm';
    }
    timeString = time.toString(10);
    if (timeString.length == 4) {
        if (timeString.substring(0, 2) == '0') {
            return `12:${((timeString.substring(2, 4) / 100) * 60)
                .toString(10)
                .padEnd(2, '0')}${half}`;
        }
        return `${timeString.substring(0, 2)}:${((timeString.substring(2, 4) / 100) * 60)
            .toString(10)
            .padEnd(2, '0')}${half}`;
    } else if (timeString.length == 3) {
        if (timeString.substring(0, 1) == '0') {
            return `12:${((timeString.substring(1, 3) / 100) * 60)
                .toString(10)
                .padEnd(2, '0')}${half}`;
        }
        return `${timeString.substring(0, 1)}:${((timeString.substring(1, 3) / 100) * 60)
            .toString(10)
            .padEnd(2, '0')}${half}`;
    } else {
        if (timeString.substring(0, 1) == '0') {
            return `12:${((time / 100) * 60).toString(10).padEnd(2, '0')}${half}`;
        }
    }
}

async function createSchedule(req) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const shifts = [
        'monShift',
        'tueShift',
        'wedShift',
        'thShift',
        'friShift',
        'satShift',
        'sunShift'
    ];
    var wb = xlsx.utils.book_new();
    wb.Props = {
        Title: `Schedule for ${req.session.currentGroup.name}`,
        Subject: 'Daily Schedules',
        Author: `${req.session.profile.name} and powered by SmartBoss`
        //CreatedDate: new Date()
    };
    for (var i = 0; i < 1; i++) {
        const daySchedule = req.session.finalizedSchedule[i];
        var data = [];
        for (const item in daySchedule) {
            data.push(daySchedule[item]);
        }
        var ws = xlsx.utils.aoa_to_sheet(data);
        ws['!cols'] = [{ wch: 30 }, { wch: 30 }, { wch: 30 }];
        xlsx.utils.book_append_sheet(wb, ws, days[i]);
    }
    xlsx.writeFile(wb, 'Schedule.xlsx');
    return true;
}

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
