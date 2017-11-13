var express = require('express'),
    router = express.Router(),
    https = require("https"),
    users = require('../controllers/user'),
    reviews = require('../controllers/reviews'),
    promo = require('../controllers/promo'),
    passport = require('passport'),
    passportConfig = require ('../../config/passport'),
    google = require('googleapis'),
    OAuth2 = google.auth.OAuth2;

module.exports = function(app) {
  app.use('/', router);
};

router.post('/searchUser', users.searchUser);
router.get('/login',passport.authenticate('google',{ scope: ['profile','email','https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.force-ssl', 'https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/youtubepartner'],accessType: 'offline'}));
router.get('/login/google/callback', passport.authenticate('google', { successRedirect: 'http://localhost/test1/',failureRedirect: 'http://localhost/test1/'}));

router.get('/logout',passportConfig.estaAutenticado, users.logout);
router.get('/userInfo', passportConfig.estaAutenticado, function (req,res) {
  res.json({username: req.user.username, _id: req.user._id, verifiedUser: req.user.verifiedUser});
});
//TODO: Cambiar las URIs
router.post('/movie',passportConfig.estaAutenticado, reviews.createReview);
router.post('/deleteMovie',passportConfig.estaAutenticado, reviews.deleteReview);
router.get('/movie', reviews.getAllReviews);
router.post('/searchMovie', reviews.searchReviews);
router.post('/movieGenre', reviews.searchReviewsByCategory);
router.post('/myContent',passportConfig.estaAutenticado, reviews.getMyReviews);
router.post('/update',passportConfig.estaAutenticado, reviews.updateReview);

router.get('/createPromo',promo.getView);
router.post('/createPromo', promo.createPromo);
router.post('/searchPromo', promo.searchPromo);
router.post('/searchPromoByCategory', promo.searchPromoByCategory);
router.get('/promos', promo.getAllPromos);


