angular.module('instagram.directives')
.directive('igPost', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: function(element,attrs){
      return 'templates/post-'+ attrs.size +'.html';
    }
  }
});