angular.module('userApp').controller('homeController',function($scope){

    // toggle fullscreen
    document.body.addEventListener('touchend',function(){
        document.documentElement.webkitRequestFullScreen();
        document.querySelector('#md-tabs').classList.remove('under-toolbar');
        document.querySelector('#md-tabs').classList.add('full-screen');
    },{once:true})



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

})