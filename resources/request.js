function updateSkill() {
    const dayAvail = [
        'monShift',
        'tueShift',
        'wedShift',
        'thShift',
        'friShift',
        'satShift',
        'sunShift'
    ];
    const monShift = timeHandler(dayAvail[0]);
    const tueShift = timeHandler(dayAvail[1]);
    const wedShift = timeHandler(dayAvail[2]);
    const thShift = timeHandler(dayAvail[3]);
    const friShift = timeHandler(dayAvail[4]);
    const satShift = timeHandler(dayAvail[5]);
    const sunShift = timeHandler(dayAvail[6]);

    axios({
        method: 'patch',
        url: '/employer/group/skill',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        data: {
            name: name.value,
            description: description.value,
            monShift: monShift,
            tueShift: tueShift,
            wedShift: wedShift,
            thShift: thShift,
            friShift: friShift,
            satShift: satShift,
            sunShift: sunShift
        }
    }).then((res) => {
        //const groupData = res.data.data;
        //console.log(groupData);
        //render('groupPage', groupData);
        window.location = '/employer/group';
    });
}

function timeHandler(day) {
    var shift = [];
    var variableName = `${day}Hours time`;
    shift.push(window[variableName].value);
    var variableName = `${day}MinutesStart`;
    shift.push(window[variableName].value);
    var variableName = `${day}HalfStart`;
    shift.push(window[variableName].value);
    var variableName = `${day}HoursEnd`;
    shift.push(window[variableName].value);
    var variableName = `${day}MinutesEnd`;
    shift.push(window[variableName].value);
    var variableName = `${day}HalfEnd`;
    shift.push(window[variableName].value);
    return shift;
}

function updateAvailability() {
    const dayAvail = [
        'monAvail',
        'tueAvail',
        'wedAvail',
        'thAvail',
        'friAvail',
        'satAvail',
        'sunAvail'
    ];

    const monAvail = timeHandler(dayAvail[0]);
    const tueAvail = timeHandler(dayAvail[1]);
    const wedAvail = timeHandler(dayAvail[2]);
    const thAvail = timeHandler(dayAvail[3]);
    const friAvail = timeHandler(dayAvail[4]);
    const satAvail = timeHandler(dayAvail[5]);
    const sunAvail = timeHandler(dayAvail[6]);

    axios({
        method: 'patch',
        url: '/employee/group/',
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        data: {
            name: name.value,
            description: description.value,
            monAvail: monAvail,
            tueAvail: tueAvail,
            wedAvail: wedAvail,
            thAvail: thAvail,
            friAvail: friAvail,
            satAvail: satAvail,
            sunAvail: sunAvail
        }
    }).then((res) => {
        //const groupData = res.data.data;
        //console.log(groupData);
        //render('groupPage', groupData);
        window.location = '/employee/group';
    });
}

function calculateVal(time) {
    var val = [];
    var half = 0;
    if (time >= 1200) {
        time = time - 1200;
        half = 1200;
    }
    if (time.length == 4) {
        val.push(time.splice(0, 2));
        val.push(time.splice(2, 2));
        val.push(half);
    } else if (time.legth == 3) {
        val.push(time.splice(0, 1));
        val.push(time.splice(1, 2));
        val.push(half);
    } else {
        val.push(0);
        val.push(time);
        val.push(half);
    }
    return val;
}

function selectedFormat(value) {
    var val = [];
    var start = value[0];
    var end = value[1];

    val = calculateVal(start);
    val.concat(calculateVal(end));
    return val;
}
