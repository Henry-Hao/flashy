angular.module('userApp').component('hint',{
    bindings:{
        hint:'<'
    },
    templateUrl:'/template/directives/hint.html',
    
    controller:function($scope){
        console.log('hint')
    }
})