var myApp = angular.module('userApp',['ng','ui.router','onsen']);
myApp.config(function($httpProvider,$stateProvider, $urlRouterProvider){
    $httpProvider.defaults.xsrfCookieName = 'csrfmiddlewaretoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    var state = [
        {
            name:'home',
            url:'/home',
            component:'flCard'
        }
    ];

    state.forEach(state => {
        $stateProvider.state(state);
    });
    $urlRouterProvider.when('','/home');
})