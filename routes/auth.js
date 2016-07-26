var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', function(req, res, next) {
  res.send('Auth');
});

router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

module.exports = router;
