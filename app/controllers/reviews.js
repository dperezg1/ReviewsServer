/**
 * Created by USER on 28/07/2017.
 */

// https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=AcUauzCn7RE&key=AIzaSyAoypiXgRhzBTYRHLc15ygU5SaYdw347tE
var mongoose = require('mongoose'),
  Review = mongoose.model('Review'),
    User = mongoose.model('User'),
    https = require('https');

module.exports = {
    createReview: function (req, res) {
        User.findOne({username: req.user.username}, function (err, user) {
            if (user) {
                var str = '';
                var options = {
                    host: 'www.googleapis.com',
                    port: '443',
                    path: '/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=' + req.body.youtubeLink.split('=')[1] + '&key=AIzaSyAoypiXgRhzBTYRHLc15ygU5SaYdw347tE'
                };

                callback = function (response) {
                    response.on('data', function (chunk) {
                        str += chunk;
                    });
                    response.on('end', function () {
                        var resp = JSON.parse(str);
                        var review = new Review({
                            product: req.body.product,
                            youtubeName: resp.items[0].snippet.title,
                            youtubeDate: resp.items[0].snippet.publishedAt,
                            youtubeImage: resp.items[0].snippet.thumbnails.medium.url,
                            youtubeLink: req.body.youtubeLink,
                            category: req.body.category,
                            verifiedUser: req.user.verifiedUser,
                            brand: req.body.brand,
                            owner_username: req.user.username,
                            goodRate: resp.items[0].statistics.likeCount,
                            badRate: resp.items[0].statistics.dislikeCount
                        });
                        review.save(function (err) {
                            if (err) {
                                return res.status(500).send(err.message);
                            }
                            // send OK
                            return res.status(200).send(review);
                        })
                        console.log(resp.items[0])
                    })

                }
                var requ = https.request(options, callback).on("error", function (e) {
                })
                requ.end()
            }
            else {
                return res.status(500).send(err.message);
            }
        })


    },
    deleteReview: function (req, res) {
        Review.findByIdAndRemove(req.body._id, function (err) {
            if (!err) {
                res.status(200).send();
            } else {
                res.status(500).send(err);
            }
        });
    },
    getAllReviews: function (req, res) {
        Review.find({verifiedUser: true}, function (err, reviews) {
            if (!err) {
                res.status(200).send(reviews);
            } else {
                res.status(500).send(err);
            }
        });
    },
    searchReviews: function (req, res) {
        Review.find({$or: [{product: new RegExp(req.body.searchTerm, "i")}, {brand: new RegExp(req.body.searchTerm, "i")}, {youtubeName: new RegExp(req.body.searchTerm, "i")}, {category: new RegExp(req.body.searchTerm, "i")}]}, function (err, reviews) {
            if (!err) {
                return res.status(200).send(reviews);

            } else {
                return res.status(500).send(err);
            }
        })
    },
    searchReviewsByCategory: function (req, res) {
        Review.find({category: new RegExp(req.body.searchTerm, "i")}, function (err, reviews) {
            if (!err) {
                return res.status(200).send(reviews);
            } else {
                return res.status(500).send(err);
            }
        })
    },
    getMyReviews: function (req, res) {
        Review.find({owner_username: req.body.username}, function (err, reviews) {
            if (!err) {
                res.status(200).send(reviews);
            } else {
                res.status(500).send(err);
            }
        });
    },
    updateReview: function (req, res) {
        Review.findByIdAndUpdate(req.body._id, {
            "product": req.body.product,
            "category": req.body.category,
            "brand": req.body.brand
        }, function (err) {
            if (err) {
                res.send(err).status(500);
            } else {
                res.send("actualizada exitosamente").status(200);
            }

        })
    }
};