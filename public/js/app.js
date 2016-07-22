var app = angular.module("galvanizeReview", []);

app.controller("topics", function($scope,$http){
  $scope.view = {};
  $scope.view.newPost = {};
  updateTopics();

  $scope.postTopic = function() {
    $http.post('/api/topics',$scope.view.newPost).then(function (res) {
      $scope.view.newPost = {};
      updateTopics();
    })
  }

  $scope.upvote = function(id) {
    //TODO: Make RESTful - nice demo opportunity.
    var url = '/api/topics/' + id + '/upvote';
    $http.post(url).then(function (res) {
      updateTopics();
    })  }

  function updateTopics() {
    $http.get('/api/topics').then(function (res) {
      $scope.view.topics = res.data;
    })
  }
})
