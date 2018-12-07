angular.module('userApp').component('flCard',{
    bindings:{
        card:'<'
    },
    templateUrl:'/template/directives/card.html',
    controller:function($scope,CardService, $animate, $timeout){
        //show front side of the card
        $scope.frontage = true;
        $scope.empty = false;
        // initialization
        this.$onInit = function(){
            if(this.card == null)
                $scope.empty = true;
            else
                $scope.empty = false;
            $scope.card = this.card;
        }


        //next card
        $scope.next = function(){
            const ele = document.querySelector('.front');
            $animate.addClass(ele, 'fade').then(function(){
                $timeout(function(){
                    CardService.getNext().then(
                        function(result){
                            //error
                            if(typeof(result.data) == "object" && 'error' in result.data){
                                if(result.data.error == '535'){
                                    $scope.empty = true;
                                    $scope.card = null;
                                }
                                return;
                            }

                            $scope.empty = false;
                            angular.element(ele).removeClass('fade');
                            $scope.card = result.data;
                            if($scope.card.hints.trim() != '')
                                $scope.card.hints = $scope.card.hints.trim().split('$$$');
                            $scope.$broadcast('closeHint');
                        },
                        function(result){
                        }
                    );
                },100)
                
            })
            //always show front side when click next
            $scope.frontage = true;
        }

        $scope.knowACard = function(card){
            CardService.knowACard(card).then(
                function(result){
                    //error
                    if(typeof(result.data) == "object" && 'error' in result.data){
                        if(result.data.error == '535'){
                            $scope.empty = true;
                            $scope.card = null;
                        }
                        return;
                    }
                    $scope.next();
                    $scope.empty = false;
                },
                function(result){

                }
            )
        }

        $scope.flip = function(){
            $scope.frontage = !$scope.frontage;
        }
        
        
    }
})