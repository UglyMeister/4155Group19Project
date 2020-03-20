var mongoose = require('mongoose');
mongoose.connect('mongodb://appControl:control1@ds145704.mlab.com:45704/heroku_r2hv5571', {
    useNewUrlParser: true
});
//var db = mongoose.connection;

var groupsschema = new mongoose.schema(
    {
        groupid: number,
        ownerid: number,
        memberIds: [],
        skillIds: []
    },
    { collection: 'groups' }
);

const GroupsModel = mongoose.model('Groups', groupsSchema);

module.exports = GroupsModel;
