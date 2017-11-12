/**
 * Created by USER on 27/07/2017.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User')
module.exports = {
    logout: function (req, res) {
        req.logout();
        res.send('Logout exitoso!');
    },
    searchUser: function (req, res) {
        User.findOne({username: req.body.searchTerm}, function (err, user) {
            if (!err && user) {
                var searchedUser = {
                    "username": user.username,
                    "_id": user._id
                };
                return res.status(200).send(searchedUser)
            } else {
                return res.status(200).send("hay error");
            }
        })
    }
};
