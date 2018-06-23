angular.module('instagram.controllers')
.controller('LoginCtrl', function($scope, AuthService, $state, toaster){

  $scope.login = function(user) {
    AuthService.login(user).then(function(resp) {
      if(!resp.error)
        $state.go('tab.feed');
      else
        toaster.pop('error','El usuario y la contraseña no coinciden');
    });
  };

});