const dotenv = require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const FacebookStrategy = require( 'passport-facebook' ).Strategy;
const User = require('../models/user.model');
const userService = require('../services/user.service');

passport.serializeUser(function(user, done) {
  done(null, user.socialid);
});
  
passport.deserializeUser(function(id, done) {
  userService.getUserById(id).then((user)=>{
    // console.log("USER - " + user);
    done(null, user);
  });
});

// Google Strategy

passport.use(new GoogleStrategy({
    clientID:     process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.URL +"/v1/auth/login/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    //   Continue check 
    userService.getUserById(profile.id).then((existUser)=>{
      if(existUser){
        // Create Session
        done(null, existUser);
       
      } else {
        // storing data in DB
        userService.createUser(new User({
          socialid: profile.id,
          logintype: 'google',
          username: profile.displayName,
          email: profile.email
        })).then((user)=>{
          done(null, user);
        });
      }
    });
  }
));

// Facebook Strategy

passport.use(
  new FacebookStrategy(
    {
      clientID: "538151740678651",
      clientSecret: "3b1604247e1a5327e71790b84b58aa0a",
      callbackURL: process.env.URL +"/v1/auth/login/facebook/callback",
      profileFields: ["email", "name"]
    },
    function(accessToken, refreshToken, profile, done) {
      //   Continue check 
      userService.getUserById(profile.id).then((existUser)=>{
        if(existUser){
          // Create Session
          done(null, existUser);
         
        } else {
          // storing data in DB
          console.log(profile);
          userService.createUser(new User({
            socialid: profile.id,
            logintype: 'facebook',
            username: profile.displayName || profile.first_name+"_"+profile.last_name,
            email: profile.email
          })).then((user)=>{
            done(null, user);
          });
        }
      });
    }
  )
);


// Facebook Client Side approach
{/* <script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '{your-app-id}',
      cookie     : true,
      xfbml      : true,
      version    : '{api-version}'
    });
      
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script> */}