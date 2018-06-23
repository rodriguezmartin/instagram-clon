angular.module('instagram.services')
.service('AuthService',[
  '$http',
  'API_ROOT',
  'StorageService',
  function($http, API_ROOT, StorageService){

    var token = null;
    var userData = null;

    // Levantamos, si hay, datos de localStorage.
    if(StorageService.has('token')) {
      console.log('-Auth- Usando el token previamente guardado.');
      token = StorageService.get('token');
      userData = StorageService.get('userData');
      $http.defaults.headers.common["Authorization"] = 'Bearer '+ token;
    }
    else
      console.log('-Auth- Usuario no logeado.');

    /**
     * Intenta loguear al usuario.
     *
     * @param {{}} user
     * @returns {string}
     */
    this.login = function(user) {
      return $http.post(API_ROOT + "/login", user).then(
        function(resp) {
          resp = resp.data;
          if(!resp.error) {
            // Logueamos al usuario.
            token = resp.data.token;
            $http.defaults.headers.common["Authorization"] = 'Bearer '+ token;
            userData = {
              email: user.correo,
              id: resp.data.id,
              username: resp.data.username
            };
            console.log('-Auth- Usuario logeado',userData);

            // Almaceno también en Storage.
            StorageService.set('token', token);
            StorageService.set('userData', userData);
          }
          // Retornamos la respuesta en el resolve para que el próximo then() pueda recibirlo
          // como parámetro.
          return resp;
        }
      );
    };

    /**
     * Intenta registrar al usuario.
     *
     * @param {{}} user
     * @returns {string}
     */
    this.signin = function(user) {
      return $http.post(API_ROOT + "/signin", user).then(
        function(resp) {
          var resp = resp.data;
          if(!resp.error) console.log('-Auth- Usuario registrado con éxito');

          // Retornamos la respuesta en el resolve para que el próximo then() pueda recibirlo
          // como parámetro.
          return resp;
        }
      );
    };

    this.logout = function(){
      console.log('-Auth- Deslogeado');
      token = null;
      userData = null;
      StorageService.delete('token');
      StorageService.delete('userData');
    };

    /**
     * Indica si el usuario está autenticado.
     *
     * @returns {boolean}
     */
    this.isLogged = function() {
      return token !== null;
    };

    /**
     * Retorna el token.
     *
     * @returns {string}
     */
    this.getToken = function() {
      return token;
    };

    /**
     * Retorna el token.
     *
     * @returns {string}
     */
    this.getUserData = function() {
      return userData;
    };
  }
]);