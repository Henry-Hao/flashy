var myApp = angular.module('userApp',['ng','ui.router','ngTouch','ngAnimate','ngMaterial','ui.bootstrap']);
myApp.config(function($httpProvider,$stateProvider, $urlRouterProvider,$mdThemingProvider){
    $httpProvider.defaults.xsrfCookieName = 'csrfmiddlewaretoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('blue');

    // var state = [
    //     {
    //         name:'home',
    //         url:'/home',
    //         component:'flCard'
    //     }
    // ];

    // state.forEach(state => {
    //     $stateProvider.state(state);
    // });
    // $urlRouterProvider.when('','/home');
})