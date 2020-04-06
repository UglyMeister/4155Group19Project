var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true, useFindAndModify: false
});
//var db = mongoose.connection;

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var skillsSchema = new mongoose.Schema(
    {
        name: String,
        userIDs: [
            {
                type: ObjectId,
                ref: 'EmployeeModel'
            }
        ],
        monShift: {
            type: [Number],
            default: [0, 0, 0, 0, 0, 0]
        },
        tueShift: {
            type: [Number],
            default: [0, 0, 0, 0, 0, 0]
        },
        wedShift: {
            type: [Number],
            default: [0, 0, 0, 0, 0, 0]
        },
        thShift: {
            type: [Number],
            default: [0, 0, 0, 0, 0, 0]
        },
        friShift: {
            type: [Number],
            default: [0, 0, 0, 0, 0, 0]
        },
        satShift: {
            type: [Number],
            default: [0, 0, 0, 0, 0, 0]
        },
        sunShift: {
            type: [Number],
            default: [0, 0, 0, 0, 0, 0]
        },
        description: {
            type: String
        }
    },
    { collection: 'skills' }
);

const SkillsModel = mongoose.model('Skills', skillsSchema);

module.exports = SkillsModel;
