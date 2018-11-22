myApp.controller("LoginController",['$scope', function($scope){

    var carousel;
    ons.ready(function(){
        carousel = document.getElementById('carousel');
    })

    $scope.prev = function(){
        carousel.prev();
    };

    $scope.next = function(){
        carousel.next();
    };


}])