angular.module('instagram', [
  'ionic', 
  'instagram.controllers', 
  'instagram.services',
  'instagram.filters',
  'instagram.directives',
  'instagram.factories',
  'toaster'
])

.constant('API_ROOT', 'http://serverdeprueba.hol.es/public')
//.constant('API_ROOT', 'http://localhost/IONIC/api/public')
//.constant('API_ROOT', 'http://192.168.0.10/IONIC/api/public')

.run(function(
  $ionicPlatform, 
  $rootScope, 
  AuthService, 
  $state, 
  API_ROOT,
  ModalCommentsService,
  ModalProfileService,
  ModalPostService,
  ModalHashtagService,
  ModalChatService){
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    console.log('Corriendo en',ionic.Platform.platform());
  });

  // Detectamos el cambio de "state/route" para
  // verificar si tiene algún requerimiento.
  $rootScope.$on('$stateChangeStart', function(ev, state, params, fromState) {
    // Verificamos si la ruta requiere de la
    // autenticación.
    console.log('-Navegación- De ',fromState.name,' a ',state.name);
    if(state.data !== undefined && state.data.requireAuth === true) {
      // La vista requiere de autenticación.
      // Verificamos si el usuario está autenticado.
      if(!AuthService.isLogged()) {
        console.log('-Navegación- ERROR, esta sección requiere login y el usuario no esta logeado');
        // Cancelamos el cambio de state.
        ev.preventDefault();
        $state.go('login');
      }
    }
  });

  $rootScope.API_ROOT = API_ROOT;
  $rootScope.modalPerfil = function(username){
    ModalProfileService.open(username);
  };
  $rootScope.modalHashtag = function(hashtag){
    ModalHashtagService.open(hashtag);
  };
  $rootScope.modalComments = function(postId){
    ModalCommentsService.open(postId);
  };
  $rootScope.modalPost = function(post){
    ModalPostService.open(post);
  };
  $rootScope.modalRepost = function(post){
    ModalPostService.repost(post);
  };
  $rootScope.modalChat = function(userId){
    ModalChatService.open(userId);
  };
  $rootScope.moment = moment;
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  
  // setup an abstract state for the tabs directive

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
  })

  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'SigninCtrl',
  })

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.feed', {
    url: '/feed',
    views: {
      'tab-feed': {
        templateUrl: 'templates/tab-feed.html',
        controller: 'FeedCtrl'
      }
    },
    data: {
      requireAuth: true
    }
  })

  .state('tab.publish', {
    url: '/publish',
    views: {
      'tab-publish': {
        templateUrl: 'templates/tab-publish.html',
        controller: 'PublishCtrl'
      }
    },
    data: {
      requireAuth: true
    }
  })

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    },
    data: {
      requireAuth: true
    }
  })

  .state('tab.chats', {
    url: '/chats',
    views: {
      'tab-chats': {
        templateUrl: 'templates/tab-chats.html',
        controller: 'ChatsCtrl'
      }
    },
    data: {
      requireAuth: true
    }
  })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    },
    data: {
      requireAuth: true
    }
  });


  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/tab/feed');
  $urlRouterProvider.otherwise(function($injector) {
    var $state = $injector.get('$state');
    $state.go('tab.feed');
  });

  $httpProvider.interceptors.push('HttpInterceptor');
  
  $ionicConfigProvider.views.transition('ios');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.navBar.alignTitle('center');
  
});
