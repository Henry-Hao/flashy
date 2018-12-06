var myApp = angular.module('userApp',['ng','ui.router','ngTouch','ngAnimate','ngMaterial']);
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
            name:'card',
            url:'/card',
            component:'flCard'
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
    $urlRouterProvider.when('','/card');
})