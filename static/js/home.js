angular.module('userApp').controller('homeController',function($scope, $state){


    // toggle fullscreen
    // document.body.addEventListener('touchend',function(){
    //     document.documentElement.webkitRequestFullScreen();
    //     document.querySelector('#md-tabs').classList.remove('under-toolbar');
    //     document.querySelector('#md-tabs').classList.add('full-screen');
    // },{once:true})



    $scope.toggleFullScreen = function(){
        if(!document.webkitFullscreenElement){
            document.documentElement.webkitRequestFullScreen();
            document.querySelector('#md-tabs').classList.remove('under-toolbar');
            document.querySelector('#md-tabs').classList.add('full-screen');
        } else {
            if(document.webkitExitFullscreen){
                document.webkitExitFullscreen();
                document.querySelector('#md-tabs').classList.add('under-toolbar');
                document.querySelector('#md-tabs').classList.remove('full-screen');
            }
        }
    }

    $scope.switchTab = function(id){
        let underscore = angular.element(document.querySelector('.underscore'));
        if(id == 0){
            underscore.removeClass('right');
            $state.go('card');

        } else {
            underscore.addClass('right');
            $state.go('newCard');
        }
    }

})