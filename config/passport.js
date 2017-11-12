/**
 * Created by USER on 02/08/2017.
 */
var passport = require ('passport'),
    GoogleStrategy = require('passport-google-oauth20').Strategy,
    Usuario = require ('../app/models/user'),
    google = require('googleapis'),
    OAuth2 = google.auth.OAuth2;

passport.serializeUser(function(usuario,done){
  console.log(usuario)
  done(null,usuario._id);
})

passport.deserializeUser(function (id,done) {
  Usuario.findById(id, function (err,user) {
    done(err,user);
  })
})
passport.use(new GoogleStrategy({
        clientID:  "894365078349-cgcg4c2f5hvlcpisroo8c3tn5dt3aogb.apps.googleusercontent.com",
        clientSecret: "-OIYc3BaTRlqz50tvf9rxydi",
        callbackURL: 'http://localhost:3000/login/google/callback'
    },
    function(accessToken, refreshToken, profile, cb) {

        process.nextTick(function() {

            var oauth2Client = new OAuth2(
                "894365078349-cgcg4c2f5hvlcpisroo8c3tn5dt3aogb.apps.googleusercontent.com",
                "-OIYc3BaTRlqz50tvf9rxydi",
                'http://localhost:3000/login/google/callback'
            );

            oauth2Client.credentials = {
                access_token: accessToken,
                refresh_token: refreshToken
            };

            var da;

            google.youtube({
                version: 'v3',
                auth: oauth2Client
            }).subscriptions.list({
                part: 'subscriberSnippet',
                mySubscribers: true,
                headers: {}
            }, function(err, data, response) {
                if (err) {

                }
                if (data) {
                    console.log(data);
                    Usuario.findOne({ 'google.id': profile.id }, function(err, res) {
                        if (err)
                            return cb(err);
                        if (res) {
                            console.log("user exists");
                            return cb(null, res);
                        } else {
                            console.log("insert user");
                            Usuario.findOne({'google.id': profile.id}, function(err, user){
                                console.log(user,"google")
                                if(err)
                                    return cb(err);
                                if(user)
                                    return cb(null, user);
                                else {
                                    var verified = false;
                                    if(data.pageInfo.totalResults >= 1000){
                                        verified=true;
                                    }
                                    var newUser = new Usuario();
                                    newUser.username = profile.emails[0].value;
                                    newUser.google.id = profile.id;
                                    newUser.google.token = accessToken;
                                    newUser.google.name = profile.displayName;
                                    newUser.google.email = profile.emails[0].value;
                                    newUser.verifiedUser = verified

                                    newUser.save(function(err){
                                        if(err)
                                            throw err;
                                        return cb(null, newUser);
                                    })
                                }
                            });
                        }
                    })
                }
                if (response) {
                    console.log('Status code: ' + response.statusCode);
                }
            });

        });
    }
));

exports.estaAutenticado = function (req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }else{
    res.status(401).send('Tienes que hacer log in para acceder a este recurso');
  }
}
