angular.module('instagram.filters', [])
.filter('parseFlags',function(){
  return function(input){
    input = input || "";
    return input.replace(/#(\w+)/g, '<a ng-click="modalHashtag(\'$1\')">#$1</a>')
                  .replace(/@([\w\.]+)/g, '<a ng-click="modalPerfil(\'$1\')">@$1</a>')
                  .replace(/(http|https):\/\/([^\s]+)/g, '<a href="$1://$2">$2</a>');
  }
});