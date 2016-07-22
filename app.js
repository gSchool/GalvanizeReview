var express = require('express');
var app = express();

var api = require('./routes/api');
var apiTopics = require('./routes/apiTopics');

app.use(express.static('public'));

app.use('/api',api);
app.use('/api/topics',apiTopics);


var port = process.env.PORT || 3000;

app.listen(port);
