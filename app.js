require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var jwt = require('jsonwebtoken');

var api = require('./routes/api');
var apiTopics = require('./routes/apiTopics');
var auth = require('./routes/auth');

var knex = require('./db/knex');

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
      var tokenObj = {
        xid: profile.id,
        avatarUrl: profile._json.avatar_url,
        displayName: profile.displayName,
        username: profile.username,
        profileUrl: profile.profileUrl,
      }

      //TODO: Create/Get Account Data In Database
      // knex('users')
      // .where('id','=',tokenObj.id)
      // .first()
      // .then(function (data) {
      //   if (data) {
      //     console.log('Found');
      //   } else {
      //     console.log('Not Found');
      //   }
      // })

      //TODO: Create Token
      return done(null, {token: jwt.sign(profile,process.env.JWT_SECRET)});
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
