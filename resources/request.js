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
    var variableName = `${day}HoursStart`;
    shift.push(window[variableName].value);
    variableName = `${day}MinutesStart`;
    shift[0] = parseInt(shift[0]) + parseInt(window[variableName].value);
    variableName = `${day}HalfStart`;
    shift[0] = parseInt(shift[0]) + parseInt(window[variableName].value);
    variableName = `${day}HoursEnd`;
    shift.push(window[variableName].value);
    variableName = `${day}MinutesEnd`;
    shift[1] = parseInt(shift[0]) + parseInt(window[variableName].value);
    variableName = `${day}HalfEnd`;
    shift[1] = parseInt(shift[0]) + parseInt(window[variableName].value);
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
        window.location = `/employee/group?groupID=${res.data.message}`;
    });
}
