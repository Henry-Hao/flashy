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
            document.querySelector('#view').classList.remove('under-toolbar');
            document.querySelector('#view').classList.add('full-screen');
        } else {
            if(document.webkitExitFullscreen){
                document.webkitExitFullscreen();
                document.querySelector('#view').classList.add('under-toolbar');
                document.querySelector('#view').classList.remove('full-screen');
            }
        }
    }

    $scope.switchTab = function(id){
        let underscore = angular.element(document.querySelector('.underscore'));
        if(id == 0){
            underscore.removeClass('right');
            $state.go('learn');

        } else {
            underscore.addClass('right');
            $state.go('newCard');
        }
    }

    $scope.sessions = [
        {
            id:1,
            desc:'session1'
        },
        {
            id:2,
            desc:'session2'
        },
        {
            id:3,
            desc:'session3'
        }
    ]

    $scope.selectSession = {
        id:1,
        desc:'session1'
    }

})