angular.module('instagram.services')
.service('ModalCommentsService',[
  '$rootScope',
  '$ionicModal',
  '$http',
  'API_ROOT',
  'Classes',
  function($rootScope, $ionicModal, $http, API_ROOT, Classes){

    this.open = function(postId){

      var $scope = $rootScope.$new(false), list, thereIsMore, currentPostId = postId;

      $ionicModal.fromTemplateUrl('templates/modal-comments.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.comments = [];
        $scope.modal = modal;
        $scope.modal.show();
        thereIsMore = true;
        list = new Classes.FrozenList('post/'+ currentPostId +'/comments',5);

        $scope.loadMore = function(){
          list.getMore().then(function(resp){
            if(!resp.data.length) thereIsMore = false;
            if($scope.comments) $scope.comments = $scope.comments.concat(resp.data);
            else $scope.comments = resp.data;
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        };
        $scope.loadMore();

        $scope.isThereMore = function(){
          return thereIsMore;
        };
      });

      $scope.replyTo = function(username){
        $scope.comment.content += '@'+ username +' ';
      }

      $scope.comment = {content: ''};
      $scope.submit = function(comment){
        $http.post(API_ROOT +"/post/"+ currentPostId +'/comment', comment).then(function(resp){
          if(!resp.data.error){
            $scope.comments.unshift(resp.data.comment);
            comment.content = '';
          }
        });
      };
    };
  }
])