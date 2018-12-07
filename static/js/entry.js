var myApp = angular.module('userApp',['ng','ui.router','ngTouch','ngAnimate','ngMaterial','ngSanitize']);
myApp.config(function($httpProvider,$stateProvider, $urlRouterProvider,$mdThemingProvider){
    $httpProvider.defaults.xsrfCookieName = 'csrfmiddlewaretoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $mdThemingProvider.theme('default')
      .primaryPalette('blue',{
          'default':'900'
      })
      .accentPalette('green',{
          'default':'A200'
      });

    var state = [
        {
            name:'learn',
            url:'/learn',
            component:'flCard',
            resolve:{
                card:function(CardService){
                    return CardService.getFirst().then(
                        function(result){
                             //error
                             if(typeof(result.data) == "object" && 'error' in result.data){
                                if(result.data.error == '535'){
                                    return null;
                                }
                            }
                            if(result.data.hints.trim() != '')
                                result.data.hints = result.data.hints.trim().split('$$$');
                            return result.data;
                        },
                        function(result){
                            
                        }
                    )
                }
            }
        },
        {
          name:'newCard',
          url:'/newCard',
          component:'newCard'
        }
    ];

    state.forEach(state => {
        $stateProvider.state(state);
    });
    $urlRouterProvider.when('','/learn');
})