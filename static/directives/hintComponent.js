angular.module('userApp').component('hint',{
    bindings:{
        hint:'<',
        index:'<'
    },
    templateUrl:'/template/directives/hint.html',
    
    controller:function($scope){
        $scope.show = false;
    }
})