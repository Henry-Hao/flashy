angular.module('userApp').controller('homeController',function($scope){
    $scope.title = 'Tab 1';
    $scope.updateTitle = function($event) {
        $scope.title = angular.element($event.tabItem).attr('label');
    };

})