var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Auth');
});

router.get('/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
module.exports = router;
