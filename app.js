var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var api = require('./routes/api');
var apiTopics = require('./routes/apiTopics');
var auth = require('./routes/auth');

var GITHUB_CLIENT_ID = "129c313626e152bc6244";
var GITHUB_CLIENT_SECRET = "23382a391c69d3d4a41c5352b2f342a0d20eb51b";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "https://galvanizereview.herokuapp.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

app.use(passport.initialize());

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/auth',auth)

app.get('/auth', function(req, res, next) {
  res.send('Auth');
});

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  }
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.use('/api',api);
app.use('/api/topics',apiTopics);


var port = process.env.PORT || 3000;

app.listen(port);
