var app = angular.module("galvanizeReview", ['ngMaterial']);

app.run(function($rootScope, $location) {
  if ($location.search().token) {
    localStorage.token = $location.search().token;
    $location.search('token', null);
  }
});

app.controller("topics", function($scope,$http,$mdDialog){
  $scope.view = {};
  $scope.view.newPost = {};
  updateTopics();

  $scope.postTopic = function() {

  }

  $scope.showPrompt = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    $mdDialog.show({
      controller: DialogController,
      templateUrl: './tmpl/_newPost.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    })
    .then(function(answer) {
      $http.post('/api/topics',answer).then(function (res) {
        updateTopics();
      })
    });
  };

  $scope.upvote = function(id) {
    //TODO: Make RESTful - nice demo opportunity.
    var url = '/api/topics/' + id + '/upvote';
    $http.post(url).then(function (res) {
      updateTopics();
    })
  }

  function updateTopics() {
    $http.get('/api/topics').then(function (res) {
      $scope.view.topics = res.data;
    })
  }
})

function DialogController($scope, $mdDialog) {
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.post = function(answer) {
    $mdDialog.hide(answer);
  };
}

localStorage.token = getQueryVariable(token);

function getQueryVariable() {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}
