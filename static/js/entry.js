var myApp = angular.module('userApp',['ng','ui.router','onsen']);

myApp.config(function($urlRouterProvider,$stateProvider){
    // $urlRouterProvider.when('/','/abc');

    // state = [
    //     {
    //         name:'abc',
    //         url:'/abc',
    //         component:'indexComponent'
    //     }
    // ]

    // state.forEach(state => {
    //     $stateProvider.state(state);
    // });
})