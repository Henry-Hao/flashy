myApp.controller("LoginController", function($scope, $http){
    $scope.height = 652;
    $scope.pages = [
        {
            style:{
                height:$scope.height + 'px',
                backgroundColor:'#373B44',
                
            },
            content:"welcome1"
            
        },
        {
            style:{
                backgroundColor:'#D38312',
                height:$scope.height + 'px',
            },
            content:"welcome2"
        },
        {
            style:{
                backgroundColor:'#085078',
                height:$scope.height + 'px',
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
})