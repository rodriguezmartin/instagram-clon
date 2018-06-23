angular.module('instagram.services')
.service('ModalChatService',[
  '$rootScope',
  '$ionicModal',
  '$http',
  'API_ROOT',
  'Classes',
  'AuthService',
  function($rootScope, $ionicModal, $http, API_ROOT, Classes, AuthService){

    this.open = function(userId){

      var $scope = $rootScope.$new(false), list, thereIsMore;
      var loggedUserId = AuthService.getUserData()['id'];
      
      var checkForNewMsgs, latestMsgId = 1;
      

      
      $ionicModal.fromTemplateUrl('templates/modal-chat.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function(modal) {
        $http.get(API_ROOT +'/chats/'+ userId).then(function(resp){
          $scope.chat = resp.data.chat;
          list = new Classes.FrozenList('chat/'+ $scope.chat.id +'/messages',10);
          
          $scope.messages = [];
          $scope.modal = modal;
          $scope.modal.show();
          thereIsMore = true;

          $scope.loadNewOnes = function(){
            $http.get(API_ROOT +'/chat/'+ $scope.chat.id +'/messages/after/'+ latestMsgId).then(function(resp){
              if(resp.data){
                $scope.messages = $scope.messages.concat(resp.data);
                if($scope.messages.length) latestMsgId = $scope.messages.slice(-1)[0].id;
              }
            });
          }
          checkForNewMsgs = setInterval($scope.loadNewOnes,2000);

          $scope.$on('modal.hidden', function(event, modal) {
            clearInterval(checkForNewMsgs);
          });

          $scope.loadMore = function(){
            list.getMore().then(function(resp){
              if(!resp.data.length) thereIsMore = false;
              if($scope.messages) $scope.messages = resp.data.concat($scope.messages);
              else $scope.messages = resp.data;
              if($scope.messages.length) latestMsgId = $scope.messages.slice(-1)[0].id;
              $scope.$broadcast('scroll.infiniteScrollComplete');
            });
          };
          $scope.loadMore();

          $scope.isThereMore = function(){
            return thereIsMore;
          };
        });
      });

      $scope.newMessage = {content: ''};
      $scope.submit = function(newMessage){
        $http.post(API_ROOT +"/chat/"+ $scope.chat.id, newMessage).then(function(resp){
          if(!resp.data.error){
            //$scope.messages.push(resp.data.message);
            newMessage.content = '';
          }
        });
      };

      $scope.isMine = function(msg){
        return msg.fkusers == loggedUserId ? true : false;
      }

      $scope.calcWidth = function(msg){
        var width;
        if(msg.content.length <= 5){
          width = '20%';
        }
        else if(msg.content.length >= 80){
          width = '85%';
        }
        else{
          var OldRange = (80 - 1);
          var NewRange = (85 - 30); 
          var NewValue = (((msg.content.length - 1) * NewRange) / OldRange) + 30;
          width = NewValue +'%';
        }
        return {'width' : width};
      }
    };
  }
])