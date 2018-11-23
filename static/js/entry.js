var myApp = angular.module('userApp',['ng','ui.router','onsen']);
myApp.config(function($httpProvider){
    $httpProvider.defaults.xsrfCookieName = 'csrfmiddlewaretoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
})