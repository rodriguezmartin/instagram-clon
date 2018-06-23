angular.module('instagram.directives')
.directive('igTab', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: function(element, attrs){
        return '<button ng-click="igTabs.switch(\''+ attrs.name +'\')" ng-transclude></button>';
      },
      link: function(scope, element, attrs){
        if(!scope.igTabs) scope.igTabs = {
          tabs: {},
          currentTab: null,
          switch: function(name){
            var newTab = scope.igTabs.tabs[name];
            if(newTab){
              var tab;
              for(var key in scope.igTabs.tabs){
                tab = scope.igTabs.tabs[key];
                tab.el.className = tab.commonClass +' '+ tab.inactiveClass;
              }
              newTab.el.className = newTab.commonClass +' '+ newTab.activeClass;
              scope.igTabs.currentTab = name;
            }
          },
          isCurrentTab: function(name){
            return name === scope.igTabs.currentTab ? true : false;
          }
        };
        scope.igTabs.tabs[attrs.name] = {
          el: element[0],
          commonClass: attrs.commonclass,
          activeClass: attrs.activeclass,
          inactiveClass: attrs.inactiveclass
        };
        element[0].className = attrs.commonclass +' '+ attrs.inactiveclass;
        if(!scope.igTabs.currentTab){
          scope.igTabs.currentTab = attrs.name;
          scope.igTabs.switch(attrs.name);
        }
        element.removeAttr('commonclass');
        element.removeAttr('activeclass');
        element.removeAttr('inactiveclass');
      }
    }
  }
])

.directive('igTabContent', [
  function(){
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {},
      template: '<div ng-show="$parent.igTabs.isCurrentTab(name)" ng-transclude></div>',
      link: function(scope, element, attrs){
        scope.name = attrs.for;
      }
    }
  }
]);