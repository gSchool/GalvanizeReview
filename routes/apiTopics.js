var express = require('express');
var router = express.Router();
var knex = require('../db/knex');

router.get('/', function(req, res, next) {
  knex('topics').then(function(data) {
    res.send(data);
  });
});

router.post('/', function(req,res,next) {
  if (!req.body.topic ||
    !req.body.topic.title ||
    !req.body.topic.name ||
    !req.body.topic.description) {
    res.status(400).json({ error: 'Bad Request' });
  }
  knex('topics')
    .insert({
      title: req.body.topic.title,
      name: req.body.topic.name,
      description: req.body.topic.description,
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


module.exports = router;
