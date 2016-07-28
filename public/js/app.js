var app = angular.module("galvanizeReview", ['ngMaterial']);

app.config( [ '$httpProvider','$locationProvider','$mdThemingProvider',function( $httpProvider,$locationProvider,$mdThemingProvider) {
   $locationProvider.html5Mode( true );
   $httpProvider.interceptors.push('jwtInterceptor');
   $mdThemingProvider.theme('default')
  .primaryPalette('blue-grey')
  .accentPalette('grey');
}])
.service('jwtInterceptor', function jwtInterceptor(){
  return {
    // always make sure to return anything you use here!
    request: function(config){
      if (localStorage.token) {
        config.headers.Authorization = 'Bearer ' + localStorage.token;
      }
      return config;
    }
  };
});


app.run(function($rootScope, $location) {
  if ($location.search().hasOwnProperty( 'token' ) ) {
   localStorage.token = $location.search().token;
   $location.search('token',null);
  }

  if (localStorage.token) {
    $rootScope.user = jwt_decode(localStorage.token);
  }
});

app.controller("topics", function($scope,$rootScope,$http,$mdDialog, $location){
  $scope.view = {};
  $scope.view.newPost = {};

  $scope.view.archived = false;
  updateTopics();

  $scope.archive = function(id) {
    var url = '/api/topics/' + id + '/archive';
    $http.post(url).then(function (res) {
      updateTopics();
    })
  }

  $scope.delete = function(id) {
    var url = '/api/topics/' + id;
    $http.delete(url).then(function (res) {
      updateTopics();
    })
  }

  $scope.filterFn = function(topic)
  {
    if (!$scope.view.archived) {
      return topic.isActive;
    }
    return true;
  };

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

  $scope.unarchive = function(id) {
    var url = '/api/topics/' + id + '/unarchive';
    $http.post(url).then(function (res) {
      updateTopics();
    })
  }

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
