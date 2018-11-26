angular.module('userApp').component('flCard',{
    templateUrl:'/template/directives/card.html',
    controller:function($scope){
        $scope.name = 'card';
    }
})