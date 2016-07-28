var express = require('express');
var router = express.Router();
var knex = require('../db/knex');



router.get('/', function(req, res, next) {
  knex.select('topics.*, users.displayName').from('topics').leftJoin('users', 'topics.postedBy', 'users.id')
  .then(function(data) {
    res.send(data);
  });
});



router.post('/', function(req,res,next) {
  console.log();
  if (!req.body ||
    !req.body.title ||
    !req.body.name ||
    !req.body.description) {
    res.status(400).json({ error: 'Bad Request' });
  }
  knex('topics')
    .insert({
      title: req.body.title,
      postedBy: req.decodedToken.id,
      description: req.body.description,
      score: 1,
      isActive: true
    })
    .then(function() {
      res.send("Topic Added");
    })
    .catch(function(err) {
      next(err);
    });
});

router.post('/:id/upvote', function(req,res,next) {
  knex('topics')
  .where('id','=',req.params.id)
  .increment('score',1)
  .then(function () {
    res.send("Upvoted")
  })
});



router.post('/:id/archive', function(req,res,next) {
  knex('topics')
  .where('id','=',req.params.id)
  .update({
    isActive: false
  })
  .then(function () {
    res.send("Archived")
  })
});

router.post('/:id/unarchive', function(req,res,next) {
  knex('topics')
  .where('id','=',req.params.id)
  .update({
    isActive: true
  })
  .then(function () {
    res.send("Unarchived")
  })
});
module.exports = router;
