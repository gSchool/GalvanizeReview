var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', function(req, res, next) {
  res.send('Auth');
});

router.get('/github',
  passport.authenticate('github', { session:false, scope: [ 'user:email' ] }),
  function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  }
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.json(res.user);
    // res.redirect('/');
  }
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
