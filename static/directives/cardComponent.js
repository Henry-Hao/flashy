angular.module('userApp').component('flCard',{
    templateUrl:'/template/directives/card.html',
    controller:function($scope){
        $scope.frontage = true;
        $scope.hints = [
            {
                'content':'hint1'
            },
            {
                'content':'hint2'
            }
        ]
    }
})