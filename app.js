require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var jwt = require('jsonwebtoken');
var bearerToken = require('express-bearer-token');

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
        xprovider: profile.provider,
        avatarUrl: profile._json.avatar_url,
        displayName: profile.displayName,
        username: profile.username,
        profileUrl: profile.profileUrl,
        email: profile._json.email
      }

      knex('users')
      .where('xid','=',tokenObj.xid)
      .first()
      .then(function (data) {
        if (data) {
          tokenObj.id = data.id;
          tokenObj.isAdmin = data.isAdmin;
          return done(null, {token: jwt.sign(tokenObj,process.env.JWT_SECRET)});
        } else {
          knex('users')
            .insert({
              xid:tokenObj.xid,
              xprovider:tokenObj.xprovider,
              username:tokenObj.username,
              email:tokenObj.email,
              displayName:tokenObj.displayName,
              avatarUrl:tokenObj.avatarUrl,
              profileUrl:tokenObj.profileUrl,
              isAdmin: false
            })
            .returning('id')
            .then(function (id) {
              if (Array.isArray(id)) {
                id = id[0];
              }
              tokenObj.id = id;
              return done(null, {token: jwt.sign(tokenObj,process.env.JWT_SECRET)});
            })
        }
      })
    });
  }
));

app.use(passport.initialize());

app.use(bearerToken());

app.use(function (req,res,next) {
  jwt.verify(req.token, process.env.JWT_SECRET,function (err,decoded) {
    if (!err) {
      req.decodedToken = decoded;
    }
    next();
  });
});
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/auth',auth)

app.use('/api',api);
app.use('/api/topics',apiTopics);


var port = process.env.PORT || 3000;

app.listen(port);
