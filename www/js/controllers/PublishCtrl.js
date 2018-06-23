angular.module('instagram.controllers')
.controller('PublishCtrl', function($scope, $ionicModal, $timeout, API_ROOT, $http, MediaService, $state){
  
  $scope.$on("$ionicView.loaded", function(event){
    MediaService.setCameraDiv(document.getElementById('camara'));
  });

  $scope.$on("$ionicView.enter", function(event){
    MediaService.camera.show();
  });
  $scope.$on("$ionicView.leave", function(event){
    MediaService.camera.hide();
  });

  $ionicModal.fromTemplateUrl('templates/modal-postdescription.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.post = {
    descr: ''
  };
  
  $scope.layout = 1;
  $scope.setLayout = function(layout){
    $scope.layout = layout;
    $scope.$evalAsync();
  };

  var picture;
  $scope.getPicture = function(source){
    (source === 'camera' 
      ? MediaService.camera.takePicture()
      : MediaService.grabFromGallery()
    ).then(function(base64Image){
      MediaService.camera.hide();
      MediaService.previewResult.show(base64Image);
      picture = base64Image;
      $scope.setLayout(2);
    });
  };
  $scope.switchCamera = MediaService.camera.switch;

  $scope.keep = function(){
    $scope.modal.show();
  };
  $scope.discard = function(){
    MediaService.previewResult.hide();
    MediaService.camera.show();
    $scope.setLayout(1);
  };

  $scope.submitForm = function(){
    console.log('Publish submit');
    $timeout(function(){
      angular.element(document.querySelector('#descriptionForm')).triggerHandler('submit');
    });
  };
  $scope.publish = function(post){
    console.log('Publish publish');
    post.picture = picture;
    $http.post(API_ROOT +'/posts', post).then(function(resp){
      if(!resp.data.error){
        $scope.modal.hide();
        $scope.post.descr = '';
        $scope.discard();
        $state.go('tab.profile');
      }
    });
  };

});