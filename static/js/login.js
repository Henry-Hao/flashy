myApp.controller("LoginController", function($scope, $http, $document){
    // toggle fullscreen
    $document[0].body.addEventListener('touchend',function(){
        $document[0].documentElement.webkitRequestFullScreen();
    },{once:true})
    $scope.height = '652px';
    $scope.showIndicator = true;

    $scope.pages = [
        {
            style:{
                backgroundColor:'#373B44',
                height:$scope.height
            },
            content:"welcome1"
            
        },
        {
            style:{
                backgroundColor:'#D38312',
                height:$scope.height
            },
            content:"welcome2"
        },
        {
            style:{
                backgroundColor:'#085078',
                height:$scope.height
            },
            content:"welcome3"
        }
    ];

    $scope.loginInfo = {
        username:'henry',
        password:'henryhao'
    }

    $scope.login = function(){
        $http.post('/login',$scope.loginInfo).then(
            function(result){
                location.reload();
            },
            function(result){
                $scope.loginInfo.password = "";
            }
        )
    }

    $scope.swipe = function(direction){
        const items = $('.carousel-item');
        if(direction > 0 && !(items[items.length - 1].classList.contains('active'))){
            // swipe left
            $('#carousel').carousel('next');
        }
        if(direction < 0 && !(items[0].classList.contains('active'))){
            // swipe right
            $('#carousel').carousel('prev');
        }

        if(items.length > 1 && items[items.length - 2].classList.contains('active') && direction > 0)
            $scope.showIndicator = false;
        else
            $scope.showIndicator = true;
    }
})