angular.module('instagram.directives')
.directive('igLikeswidget', [
  'toaster',
  '$http',
  'API_ROOT',
  function(toaster, $http, API_ROOT) {
    return {
      restrict: 'E',
      replace: true,
      template: '<li>'+
        '<a ng-click="like(post.id)"></a>'+
        '<a class="counter" ng-show="post.likes_count != \'0\'">{{post.likes_count}}</a>'+
      '</li>',
      link: function(scope, element){
        var button = element[0].children[0];
        scope.applyClass = function(){
          button.className = 'button button-icon ';
          button.className += scope.post.loggedUserLikedIt ? 'ion-ios-heart' : 'ion-ios-heart-outline'; 
        }
        scope.applyClass();
        scope.like = function(){
          button.className += ' liking';
          $http.post(API_ROOT +'/posts/'+ scope.post.id +'/like').then(function(resp){
            if(!resp.data.error){
              if(scope.post.loggedUserLikedIt) 
                scope.post.likes_count--;
              else
                scope.post.likes_count++;
              scope.post.loggedUserLikedIt = !scope.post.loggedUserLikedIt;
              scope.applyClass();
            }
            else
              toaster.pop('error',resp.data.msg);
          });
        }
      }
    }
  }
]);