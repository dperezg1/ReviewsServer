/**
 * Created by USER on 28/07/2017.
 */
var multer = require('multer');
var mongoose = require('mongoose'),
  path = require('path'),
  fs = require('fs'),
  Movie = mongoose.model('Movie');



var storage = multer.diskStorage({ //multers disk storage settings

  destination: function (req, file, cb) {

    cb(null, '/mnt/');

  },

  filename: function (req, file, cb) {

    cb(null, file.originalname);

  }

});




module.exports = {
  createMovie: function (req, res) {
    var movie = new Movie({
      title: req.body.title,
      year: req.body.year,
      genre: req.body.genre,
      size: req.body.size,
      director: req.body.director,
      imageUrl: req.body.imageUrl,
      owner_username: req.body.owner_username,
      filename: req.body.filename,
      visibility: req.body.visibility,
      shared_with: req.body.shared_with
    });
    movie.save(function (err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      // send OK
      return res.status(200).send(movie);
    })
  },
  deleteMovie: function (req, res) {
    Movie.findByIdAndRemove(req.body._id, function (err) {
      if (!err) {
        res.status(200).send();
      } else {
        res.status(500).send(err);
      }
    });
  },
  getAllMovies: function (req, res) {
    Movie.find({visibility: "public"}, function (err, movies) {
      if (!err) {
        res.status(200).send(movies);
      } else {
        res.status(500).send(err);
      }
    });
  },
  searchMovies: function (req, res) {
    Movie.find({title: new RegExp(req.body.searchTerm, "i"), visibility: "public"}, function (err, movies) {
      if (!err) {
        return res.status(200).send(movies);

      } else {
        return res.status(500).send(err);
      }
    })
  },
  searchMoviesByGenre: function (req, res) {
    Movie.find({genre: new RegExp(req.body.searchTerm, "i"), visibility: "public"}, function (err, movies) {
      if (!err) {
        return res.status(200).send(movies);
      } else {
        return res.status(500).send(err);
      }
    })
  },
  moviesSharedWith: function (req, res) {
    Movie.find({shared_with: req.body.username}, function (err, movies) {
      if (!err) {
        return res.status(200).send(movies);
      } else {
        return res.status(500).send(err);
      }
    })
  },
  getMyMovies: function (req, res) {
    Movie.find({owner_username: req.body.username}, function (err, movies) {
      if (!err) {
        res.status(200).send(movies);
      } else {
        res.status(500).send(err);
      }
    });
  },
  shareMovieWith: function (req, res) {
    Movie.findByIdAndUpdate(req.body._id, {$push: {'shared_with': req.body.username}}, {"new": true, "upsert": true}
      , function (err) {
        if (err) {
          res.send(err).status(500);
        } else {
          res.send("").status(200);
        }
      });
  },

  updateMovie: function (req, res) {
    Movie.findByIdAndUpdate(req.body._id, {
        "title": req.body.title,
        "year": req.body.year,
        "imageUrl": req.body.imageUrl,
        "director": req.body.director,
        "visibility": req.body.visibility,
        "genre": req.body.genre,
        "size": req.body.size
      }
      , function (err) {
        if (err) {
          res.send(err).status(500);
        } else {
          res.send("actualizada exitosamente").status(200);
        }

      })
  },
  stream: function (req, res) {
    const path = '/mnt/' + req.query.filename;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4'
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res)
  },
  upload: function (req, res) {
    var upload = multer({
      storage: storage,
      fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.mp4' && ext !== '.mkv' && ext !== '.flv') {
          return callback(res.end('Only Video are allowed'), null)
        }

        callback(null, true)
      }
    }).single('userFile');
    upload(req, res, function (err) {
      res.send('File is uploaded')
    })
  }
};
