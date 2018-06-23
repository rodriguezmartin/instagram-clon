angular.module('instagram.services')
.service('ModalPostService',[
  '$rootScope',
  '$ionicModal',
  'Classes',
  '$timeout',
  '$http',
  'API_ROOT',
  function($rootScope,$ionicModal,Classes,$timeout,$http,API_ROOT){

    this.open = function(post){

      var $scope, list, thereIsMore;

      new Promise(function(resolve,reject){
        if(typeof post !== 'object')
          $http.get(API_ROOT +'/posts/'+ post).then(function(resp){
            resolve(resp.data.post);
          });
        else
          resolve(post);
      }).then(function(post){
        $scope = $rootScope.$new(false);
        $scope.post = post;
  
        $ionicModal.fromTemplateUrl('templates/modal-post.html', {
          scope: $scope,
          animation: 'slide-in-right'
        }).then(function(modal){
          $scope.comments = [];
          $scope.modal = modal;
          $scope.modal.show();
          thereIsMore = true;
          list = new Classes.FrozenList('post/'+ post.id +'/comments',5);
  
          $scope.loadMore = function(){
            list.getMore().then(function(resp){
              if(!resp.data.length) thereIsMore = false;
              $scope.comments = $scope.comments.concat(resp.data);
              $scope.$broadcast('scroll.infiniteScrollComplete');
            });
          };
  
          $scope.isThereMore = function(){
            return thereIsMore;
          }
        });
      })
    };

    this.repost = function(postt){
      
      var $scope = $rootScope.$new(false);

      $ionicModal.fromTemplateUrl('templates/modal-postdescription.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
        $scope.post = {
          descr: postt.descr
        }
        $scope.publish = function(data){
          $http.post(API_ROOT +'/posts/'+ postt.id +'/repost', data).then(function(resp){
            if(!resp.data.error){
              $scope.modal.hide();
              $scope.post.repost_count++;
            }
            else
              toaster.pop('error',resp.data.msg);
          });
        }
        $scope.submitForm = function(){
          $timeout(function(){
            angular.element(document.querySelector('#descriptionForm')).triggerHandler('submit');
          });
        };
      });
    }
  }
])