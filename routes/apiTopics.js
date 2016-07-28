var express = require('express');
var router = express.Router();
var knex = require('../db/knex');



router.get('/', function(req, res, next) {
  knex('topics')
  .select(
    'topics.id',
    'topics.title',
    'topics.description',
    'topics.score',
    'topics.isActive',
    'topics.created_at',
    'topics.updated_at',
    'users.displayName as postedBy')
  .leftJoin('users','topics.postedBy','users.id')
  .where('isDeleted','=',false)
  .then(function(data) {
    res.send(data);
  });
});

router.use(function (req,res,next) {
  if (req.decodedToken) {
    next();
  } else {
    res.status(400).json({ error: 'Bad Request' });
  }
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

router.use(function (req,res,next) {
  if (req.decodedToken.isAdmin) {
    next();
  } else {
    res.status(400).json({ error: 'Bad Request' });
  }
});

router.delete('/:id', function (req,res,next) {
  knex('topics')
  .where('id','=',req.params.id)
  .update({
    isDeleted: true
  })
  .then(function () {
    res.send("Deleted")
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
