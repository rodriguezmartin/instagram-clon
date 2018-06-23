angular.module('instagram.controllers')
.controller('SigninCtrl', function($scope, AuthService, $state, toaster){

  $scope.signin = function(user){
    if(user.pwd1 == user.pwd2){
      AuthService.signin(user).then(function(resp) {
        if(!resp.error){
          toaster.pop('success','Usuario registrado con éxito');
          $state.go('login');
        }
        else if(resp.error == 1)
        toaster.pop('error',resp.msg);
      });
    }
    else{
      toaster.pop('error','Las contraseñas no coinciden');
    }
  };

});