angular.module('instagram.controllers')
.controller('SearchCtrl', function($scope, ModalProfileService, Classes, $http, API_ROOT){

  $scope.posts = [];
  
  var list = new Classes.FrozenList('discover',15);

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

  $scope.$watch('query',function(){
    if($scope.query && $scope.query.length > 2){
      Promise.all([
        $http.get(API_ROOT +'/search/hashtag/'+ encodeURIComponent($scope.query)),
        $http.get(API_ROOT +'/search/account/'+ encodeURIComponent($scope.query))
      ]).then(function(resp){
        $scope.hashtags = angular.fromJson(resp[0].data.hashtags);
        $scope.accounts = angular.fromJson(resp[1].data.accounts);
        $scope.$evalAsync();
      });
    }
    else{
      $scope.hashtags = [];
      $scope.accounts = [];
      $scope.$evalAsync();
    }
  });

});