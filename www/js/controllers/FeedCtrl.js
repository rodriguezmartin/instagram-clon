angular.module('instagram.controllers')
.controller('FeedCtrl', function($scope, ModalProfileService, Classes, $http, API_ROOT){

  $scope.posts = [];
 
  var list = new Classes.FrozenList('feed',5);

  var thereIsMore = true;
  $scope.isThereMore = function(){
    return thereIsMore;
  };

  $scope.loadMore = function(replace){
    list.getMore().then(function(resp){
      if(!resp.data.length) thereIsMore = false;
      $scope.posts = replace ? resp.data : $scope.posts.concat(resp.data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };
  //$scope.loadMore();

  $scope.refresh = function(){
    thereIsMore = true;
    list.reset();
    $scope.loadMore(true);
    $scope.$broadcast('scroll.refreshComplete');
  };
});