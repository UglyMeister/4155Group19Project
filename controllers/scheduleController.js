const EmployeeModel = require('./../models/employee');
const EmployerModel = require('./../models/employer');
const GroupModel = require('./../models/group');
const SkillModel = require('./../models/skill');
const xlsx = require('xlsx');
const fs = require('fs');
const mail = require('./../util/mail');

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
        req.session.finalizedSchedule = [];
        req.session.unusedEmployees = [];
    }
    const day = parseInt(req.body.day) + 1;
    req.session.finalizedSchedule.push(await dayScheduleFormat(req.body));
    req.session.unusedEmployees.push(await createBackupPerDay(req, day - 1));
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
        await createSchedule(req);
        await createBackup(req);
        var date = new Date();
        var employees = await EmployeeModel.find({
            _id: { $in: req.session.currentGroup.memberIDs }
        });
        date = date.toString();
        var message = 'Email for schedule created on: ' + date;
        var employer = req.session.profile;
        var subject = 'Email for schedule created on: ' + date;
        mail.mail(message, employer, subject);
        for (m in employees) {
            mail.mail(message, employees[m], subject, './Schedule.xlsx');
        }
        var message = 'Email for schedule backup created on: ' + date;
        var employer = req.session.profile;
        var subject = 'Email for schedule backup created on: ' + date;
        mail.mail(message, employer, subject, './backup.xlsx');
        res.redirect('/');
    }
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
//take in req and day as an int value as params
//It then finds all employees and in first for loop removes any that have a zero difference between
//and end availability if that is not the case then it populates all that are left in a map with the User's name as
//the key and _id as their value.
//
//next for loop adds in all user's names from schedule.ejs with false values will override any keys that match
//
//final for loop iterates over map and any non-false valuse are added to the backup array of arrays
async function createBackupPerDay(req, day) {
    var backup = [];
    backup.push([['Employee Name'], ['Start Time'], ['End Time']]);
    const avail = [
        'monAvail',
        'tueAvail',
        'wedAvail',
        'thAvail',
        'friAvail',
        'satAvail',
        'sunAvail'
    ];
    var unusedUsers = new Map();
    const employees = await EmployeeModel.find({
        _id: { $in: req.session.currentGroup.memberIDs }
    });
    for (var i = 0; i < employees.length; i++) {
        const employee = employees[i];
        const temp = `${avail[day]}`;
        if (employee[temp][0] - employee[temp][1] == 0) {
            employees.splice(i, 1);
            i--;
        } else {
            unusedUsers.set(employee.name, employee._id);
        }
    }
    for (var i = 1; i < req.body.length; i += 4) {
        unusedUsers.set(req.body[`skillEmployee[${i}]`], false);
    }
    for (const [key, value] of unusedUsers.entries()) {
        if (value) {
            const employee = await EmployeeModel.findById(value);
            backup.push([
                [employee.name],
                [timeFormat(employee[`${avail[day]}`][0])],
                [timeFormat(employee[`${avail[day]}`][1])]
            ]);
        }
    }
    return backup;
}

//req as a param
//This function creates the backup.xlsx file using the aoa in req.session.unusedEmployees
async function createBackup(req) {
    fs.unlinkSync('./backup.xlsx'); //clear out the previous workbook before writing the new one
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var wb = xlsx.utils.book_new();
    wb.Props = {
        Title: `Backup for ${req.session.currentGroup.name}`,
        Subject: 'Daily Backups',
        Author: `${req.session.profile.name} and powered by SmartBoss`
        //CreatedDate: new Date()
    };
    for (var i = 0; i < 7; i++) {
        const dayBackup = req.session.unusedEmployees[i];
        var data = [];
        for (const item in dayBackup) {
            data.push(dayBackup[item]);
        }
        var ws = xlsx.utils.aoa_to_sheet(data);
        ws['!cols'] = [{ wch: 30 }, { wch: 30 }, { wch: 30 }];
        xlsx.utils.book_append_sheet(wb, ws, days[i]);
    }
    xlsx.writeFile(wb, 'backup.xlsx');
}

async function createSchedule(req) {
    fs.unlinkSync('./Schedule.xlsx'); //clear out the previous workbook before writing the new one
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
        var ws = xlsx.utils.aoa_to_sheet(data);
        ws['!cols'] = [{ wch: 30 }, { wch: 30 }, { wch: 30 }];
        xlsx.utils.book_append_sheet(wb, ws, days[i]);
    }
    xlsx.writeFile(wb, 'Schedule.xlsx');
}
