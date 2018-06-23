angular.module('instagram.factories', [])
.factory('Classes', function($http, API_ROOT){
  return {
    FrozenList: function(path,chunkSize){
      var chunkNumber = 0;
      var time = moment().format('YYYY-MM-DD HH:mm:ss');
  
      this.reset = function(){
        chunkNumber = 0;
        time = moment().format('YYYY-MM-DD HH:mm:ss');
      }
  
      this.getMore = function(){
        chunkNumber++;
        var params = [
          chunkSize,
          chunkNumber * chunkSize - chunkSize,
          time
        ].join('+');
        var offset = chunkNumber * chunkSize - chunkNumber;
        return $http.get(API_ROOT +'/'+ path +'/'+ params);
      };
    }
  }
})

.factory('HttpInterceptor', function($q, toaster){
  return {
    responseError: function(rejection){
      toaster.pop('error','Imposible conectarse con el servidor.');
      //rejection.handled = true;
      return $q.reject(rejection);
    }
  };
});