angular.module('instagram.controllers')
.controller('ChatsCtrl', function($scope, $http, API_ROOT){
  $scope.$on("$ionicView.enter", function(){
    $http.get(API_ROOT +'/chats').then(function(resp){
      $scope.chats = resp.data;
    });
  });
});