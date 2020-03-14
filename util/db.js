getAll = async function(db) {
    let promise = await db.find({}).exec();
    return promise;
};

var getOne = async function(db, uname) {
    let promise = await db.find({ uname: uname }).exec();
    return promise;
};

var oneExists = function(uname) {
    if (getOne) return true;
    else return false;
};

var addNewUser = async function(db) {
    db.save();
    return;
};

module.exports.getAll = getAll;
module.exports.getOne = getOne;
module.exports.oneExists = oneExists;
module.exports.addNewUser = addNewUser;

