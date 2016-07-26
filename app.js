require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var api = require('./routes/api');
var apiTopics = require('./routes/apiTopics');
var auth = require('./routes/auth');

options = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
};


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy(
  options,
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      console.log("In Strategy Function",profile);
      return done(null, profile);
    });
  }
));

app.use(passport.initialize());

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth',auth)

app.use('/api',api);
app.use('/api/topics',apiTopics);


var port = process.env.PORT || 3000;

app.listen(port);
