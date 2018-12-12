angular.module('userApp').component('cardModal',{
    bindings:{
        card:'=',
        tags:'='
    },
    templateUrl:'/template/directives/editcard.html',
    controller:function($scope, CardService, $mdToast){
        this.$onInit = function(){
            $scope.card = this.card;
            $scope.tags = this.tags;
        }

        showToast = function(content) {
            $mdToast.show({
                hideDelay   : 1000,
                position    : 'top right',
                controller  : function($scope, $mdToast){
                    $scope.closeToast = function(){
                        $mdToast.hide();
                    }
                },
                template : `
                <md-toast>
                    <span class="md-toast-text" flex>${content}</span>
                    <md-button ng-click="closeToast()">
                        Close
                    </md-button>
                </md-toast>
                `
            });
        };

        $scope.$watchCollection('card',function(newValue, oldValue){
            if(typeof($scope.card) != 'undefined' && typeof($scope.card.tag) == 'string')
                $scope.card.tag = $scope.card.tag.split(',');
            
    
            if(typeof($scope.card) != 'undefined' && typeof($scope.card.hints) == 'string')
                $scope.card.hints = $scope.card.hints.split(',').map((value)=>decodeURIComponent(value));

            $scope.searchTerm = "";
    
        })

        $scope.add = function(){
            if($(".ng-invalid").length != 0){
                showToast('Please dont contain comma in hints.')
                return
            }
            $scope.card.hints.push('');
        }

        $scope.remove = function(index){
            if($scope.card.hints.length == 1)
                return;
            $scope.card.hints.splice(index,1);
        }

        $scope.clearSearchTerm = function(){
            $scope.searchTerm = "";
        }
        
    }
})