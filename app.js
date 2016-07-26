var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var passport = require('passport');
var ClientJWTBearerStrategy = require('passport-oauth2-jwt-bearer').Strategy;

var api = require('./routes/api');
var apiTopics = require('./routes/apiTopics');

var GITHUB_CLIENT_ID = "--insert-github-client-id-here--";
var GITHUB_CLIENT_SECRET = "--insert-github-client-secret-here--";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new ClientJWTBearerStrategy(
  function(claimSetIss, done) {
    Clients.findOne({ clientId: claimSetIss }, function (err, client) {
      if (err) { return done(err); }
      if (!client) { return done(null, false); }
      return done(null, client);
    });
  }
));

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api',api);
app.use('/api/topics',apiTopics);


var port = process.env.PORT || 3000;

app.listen(port);
