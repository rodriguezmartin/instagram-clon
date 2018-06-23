angular.module('instagram.services')
.service('ModalHashtagService',[
  '$rootScope',
  '$ionicModal',
  '$http',
  'API_ROOT',
  'Classes',
  function($rootScope, $ionicModal, $http, API_ROOT, Classes){

    this.open = function(hashtag){

      var $scope = $rootScope.$new(false), list, thereIsMore;
      
      $ionicModal.fromTemplateUrl('templates/modal-hashtag.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $scope.posts = [];
        $scope.hashtag = hashtag;
        $scope.modal = modal;
        $scope.modal.show();
        thereIsMore = true;
        list = new Classes.FrozenList('hashtag/'+ hashtag.slice(1) +'/posts',9);

        $scope.loadMore = function(){
          list.getMore().then(function(resp){
            if(!resp.data.length) thereIsMore = false;
            $scope.posts = $scope.posts.concat(resp.data);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        }
    
        $scope.isThereMore = function(){
          return thereIsMore;
        }

        $scope.refresh = function(){
          list.reset();
          $scope.posts = [];
          $scope.loadMore();
          $scope.$broadcast('scroll.refreshComplete');
        };
      });
    }
  }
]);