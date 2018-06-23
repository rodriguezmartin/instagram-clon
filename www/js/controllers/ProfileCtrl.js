angular.module('instagram.controllers')
.controller('ProfileCtrl', function(
  $scope,
  AuthService,
  $state,
  $ionicPopup,
  $ionicModal,
  Classes,
  $http,
  API_ROOT,
  $timeout,
  toaster){

  var username, list, thereIsMore = false;
  $scope.isThereMore = function(){
    return thereIsMore;
  };
  $scope.$on("$ionicView.enter", function(){
    setTimeout($scope.refresh,500);
  });

  $scope.refresh = function(){
    username = AuthService.getUserData()['username'];

    $scope.posts = [];
    
    var list = new Classes.FrozenList('user/'+ username +'/posts',9);

    var thereIsMore = true;

    Promise.all([
      $http.get(API_ROOT +'/user/'+ username),
      list.getMore()
    ]).then(function(resp){
      $scope.user = angular.fromJson(resp[0].data.user);
      $scope.posts = resp[1].data;
      $scope.$evalAsync();
    });

  }

  $scope.loadMore = function(){
    list.getMore().then(function(resp){
      if(!resp.data.length) thereIsMore = false;
      $scope.posts = $scope.posts.concat(resp.data);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };


  $scope.logout = function(){
    $ionicPopup.confirm({
      title: '¿Cerrar sesión?',
      buttons: [{
        text: 'Cancelar',
        type: 'button-default'
      },{
        text: 'Confirmar',
        type: 'button-positive',
        onTap: function(){return true;}
      }]
    }).then(function(res) {
      if(res){
        AuthService.logout();
        $state.go('login');
      }
    });
  };


  $scope.edit = function(){
    $scope.modal = null;
    $ionicModal.fromTemplateUrl('templates/modal-profile-edit.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
      $scope.datos = {
        title: $scope.user.title,
        bio: $scope.user.bio
      }
    });
  };

  $scope.submitForm = function(){
    $timeout(function(){
      angular.element(document.querySelector('#profileForm')).triggerHandler('submit');
    });
  };

  $scope.submit = function(data){
    $http.put(API_ROOT +"/user/"+ username, data).then(function(resp){
      if(!resp.data.error){
        $scope.modal.hide();
        $scope.user = angular.fromJson(resp.data.user);
        $scope.$evalAsync();
      }
    });
  };
  
  $scope.borrarPost = function(postId){
    $ionicPopup.confirm({
      title: '¿Borrar el post?',
      template: 'Esta acción es irreversible',
      buttons: [{
        text: 'Cancelar',
        type: 'button-default'
      },{
        text: 'Confirmar',
        type: 'button-positive',
        onTap: function(){return true;}
      }]
    }).then(function(res) {
      $http.delete(API_ROOT +'/posts/'+ postId).then(function(resp){
        if(!resp.data.error){
          toaster.pop('success','El post fue eliminado.');
          $scope.refresh();
        }
      });
    });
  };

});