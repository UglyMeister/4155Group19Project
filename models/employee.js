var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true
});

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var employeeSchema = new mongoose.Schema(
    {
        name: String,
        id: {
            type: Number,
            unique: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        uname: {
            type: String,
            unique: true,
            required: true
        },
        pass: String,
        groupIDs: [
            {
                type: ObjectId,
                ref: 'group'
            }
        ],
        skillIDs: [
            {
                type: ObjectId,
                ref: 'skill'
            }
        ],
        monAvail: [],
        tueAvail: [],
        wedAvail: [],
        thAvail: [],
        friAvail: [],
        satAvail: [],
        sunAvail: []
    },
    { collection: 'employee' }
);

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
