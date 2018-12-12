angular.module('userApp').component('newCard',{
    bindings:{
        'tags':'='
    },
    templateUrl:'/template/directives/newCard.html',
    // template:'<div class="wrapper"><card-modal item="item" tags="tags"></card-modal></div>',
    controller:function($scope, CardService, $mdToast,$state){
        $scope.card = {
            hints:"",
            tag:[],
            description:"",
            anwser:""
        }
        $scope.tags = ""
        this.$onInit = function(){
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

        $scope.save = function(){
            if($(".ng-invalid").length != 0){
                showToast('Please dont contain comma in hints.')
                return
            }
            let card = {
                desc:$scope.card.description,
                hints:$scope.card.hints.map((value)=>encodeURIComponent(value)).join(','),
                tag:$scope.card.tag.join(','),
                anwser:$scope.card.anwser
            }
            CardService.createCard(card).then(
                function(result){
                    if(typeof(result.data) == "object" && 'error' in result.data){
                        if(result.data.error == '535'){

                        }
                        return;
                    }
                    if(result.data == 'success'){
                        angular.element(document.querySelector('.underscore')).removeClass('right');
                        $state.go('learn');
                    }
                        
                },
                function(result){

                }
            )
        }


    }
})