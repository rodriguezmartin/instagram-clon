angular.module('instagram.services')
.service('ModalProfileService',[
  '$rootScope',
  '$ionicModal',
  '$http',
  'API_ROOT',
  'Classes',
  function($rootScope, $ionicModal, $http, API_ROOT, Classes){

    this.open = function(username){

      var $scope = $rootScope.$new(false), list, thereIsMore;

      $ionicModal.fromTemplateUrl('templates/modal-profile.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal){
        $scope.posts = [];
        $scope.modal = modal;
        $scope.modal.show();
        var thereIsMore = true;

        var list = new Classes.FrozenList('user/'+ username +'/posts',9);
        Promise.all([
          $http.get(API_ROOT +'/user/'+ username),
          list.getMore()
        ]).then(function(resp){
          $scope.user = !resp[0].data.error ? angular.fromJson(resp[0].data.user) : false;
          $scope.posts = resp[1].data;
          $scope.$evalAsync();
        });

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
        
        $scope.follow = function(userId){
          $http.post(API_ROOT +'/user/'+ userId +'/follow').then(function(resp){
            if(!resp.data.error){
              if($scope.user.loggedUserIsFollower)
                $scope.user.followers_count--;
              else
                $scope.user.followers_count++;
              $scope.user.loggedUserIsFollower = !$scope.user.loggedUserIsFollower;
            }
          });
        }
      });
    }
  }
]);