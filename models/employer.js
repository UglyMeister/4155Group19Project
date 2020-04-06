var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true, useFindAndModify: false
});
//var db = mongoose.connection;

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var employerSchema = new mongoose.Schema(
    {
        name: String,
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
                ref: 'GroupsModel'
            }
        ]
    },
    { collection: 'employer' }
);

const EmployerModel = mongoose.model('Employer', employerSchema);

module.exports = EmployerModel;
