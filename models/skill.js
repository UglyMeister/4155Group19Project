var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true
});
//var db = mongoose.connection;

var skillsSchema = new mongoose.Schema(
    {
        groupID: Number,
        userIDs: [],
        shiftsNeeded: [],
        shiftCount: [],
        description: String
    },
    { collection: 'skills' }
);

const SkillsModel = mongoose.model('Skills', skillsSchema);

module.exports = SkillsModel;
