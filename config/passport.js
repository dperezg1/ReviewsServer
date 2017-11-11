/**
 * Created by USER on 02/08/2017.
 */
var passport = require ('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var Usuario = require ('../app/models/user');

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
    clientID:  "894365078349-b282nb278osvhnktku33s3ovrm247jks.apps.googleusercontent.com",
    clientSecret: "K9WosmWdumb90PyjFKKaWa2b",
    callbackURL: 'http://proyecto17api.dis.eafit.edu.co/login/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    process.nextTick(function(){
      Usuario.findOne({'google.id': profile.id}, function(err, user){
        console.log(user,"google")
        if(err)
          return cb(err);
        if(user)
          return cb(null, user);
        else {
          var newUser = new Usuario();
          newUser.username = profile.emails[0].value;
          newUser.google.id = profile.id;
          newUser.google.token = accessToken;
          newUser.google.name = profile.displayName;
          newUser.google.email = profile.emails[0].value;

          newUser.save(function(err){
            if(err)
              throw err;
            return cb(null, newUser);
          })
        }
      });
    });
}));

exports.estaAutenticado = function (req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }else{
    res.status(401).send('Tienes que hacer log in para acceder a este recurso');
  }
}
