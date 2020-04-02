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
    var shifts = [
        (monShift = []),
        (tueShift = []),
        (wedShift = []),
        (thShift = []),
        (friShift = []),
        (satShift = []),
        (sunShift = [])
    ];
    for (var i = 0; i < 7; i++) {
        var day = dayAvail[i];
        var shift = shifts[i];
        var variableName = `${day}HoursStart`;
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
    }
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
