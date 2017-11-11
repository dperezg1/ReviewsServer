/**
 * Created by USER on 27/07/2017.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Movie = mongoose.model('Movie'),
  passport = require('passport');

module.exports = {
  logout: function (req, res) {
    req.logout();
    res.send('Logout exitoso!');
  }
  ,
  postSignup: function (req, res, next) {
    var user = new User({
      username: req.body.username,
      password: req.body.password
    });
    User.findOne({username: req.body.username}, function (err, usuarioExistente) {
      if (usuarioExistente) {
        return res.status(400).send('Este username ya esta registrado');
      }
      user.save(function (err) {
        if (err) {
          next(err);
        }
        req.logIn(user, function (err) {
          if (err) {
            next(err);
          }
          res.send('Usuario creado exitosamente');
        })
      })
    })
  },
  deleteUser: function (req, res) {
    console.log(req.body);
    User.findOneAndRemove({username: req.body.username}, function (err) {
      if (!err) {
        res.status(200).send();
      } else {
        res.status(500).send(err);
      }
    });
    Movie.deleteMany({owner_username: req.body.username}, function (err) {
      if (!err) {
        res.status(200).send();
      } else {
        res.status(500).send(err);
      }
    });
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
  },
  updateUsername: function (req, res) {
    User.findByIdAndUpdate(req.body._id, {
        "username": req.body.username,
      }
      , function (err) {
        if (err) {
          res.send(err).status(500);
        } else {
          res.send("actualizado exitosamente").status(200);
        }
      })
  },
  updatePassword: function (req, res) {
    User.findByIdAndUpdate(req.body._id, {
        "password": req.body.password,
      }
      , function (err) {
        if (err) {
          res.send(err).status(500);
        } else {
          res.send("actualizado exitosamente").status(200);
        }
      })
  }
};
