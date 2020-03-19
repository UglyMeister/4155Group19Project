var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true
});
//var db = mongoose.connection;

var groupsSchema = new mongoose.Schema(
    {
        groupID: Number,
        ownerID: Number,
        memberIDs: [],
        skills: []
    },
    { collection: 'groups' }
);

const GroupsModel = mongoose.model('Groups', groupsSchema);

module.exports = GroupsModel;
