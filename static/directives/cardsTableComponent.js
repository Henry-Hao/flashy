angular.module('userApp').component('cardsTable',{
    templateUrl:'/template/directives/cardsTable.html',
    controller:function($scope, CardService, $mdDialog, $mdToast, $state){

        $scope.selectedTags = [];
        dig = '';
        this.$onInit = function(){
            CardService.getAllTags().then(
                function(result){
                    $scope.tags = result.data;
                    $scope.tags.forEach(tag => {
                        $scope.selectedTags.push(tag['id']);
                    });
                },
                function(result){
                    console.log('error');
                }
            );

        }

        showToast = function(content) {
            toastOpen = true;
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

        

        $scope.toggle = function(id){
            let idx = $scope.selectedTags.indexOf(id);
            if(idx == -1){
                $scope.selectedTags.push(id);
            } else {
                $scope.selectedTags.splice(idx,1);
            }

            if($scope.selectedTags.length == 0){
                if($scope.tags.length > 0){
                    $scope.selectedTags = new Array(1).fill($scope.tags[0].id);
                    showToast('Check at least one tag.');
                }
                    
            }
        }

        $scope.isChecked = function(id){
            return $scope.selectedTags.indexOf(id) > -1;
        }

        $scope.isCheckedAll = function(){
            return $scope.selectedTags.length === $scope.tags.length;
        }

        $scope.toggleAll = function(){
            if($scope.selectedTags.length === $scope.tags.length){
                if($scope.tags.length > 0)
                    $scope.selectedTags = new Array(1).fill($scope.tags[0].id);
            } else if ($scope.selectedTags.length === 0 || $scope.selectedTags.length > 0) {
                $scope.selectedTags = $scope.tags.slice(0).map((ele) => ele.id);
            }
        }

        $scope.isIndeterminate = function() {
            return ($scope.selectedTags.length !== 0 &&
                $scope.selectedTags.length !== $scope.tags.length);
        };

        //reload when selected tags change
        $scope.$watchCollection("selectedTags",function(newValue, oldValue){
                $("#table").bootstrapTable('refresh',{
                    url:'/api/getAllCards',
                    query:{
                        tags:encodeURIComponent($scope.selectedTags.join(','))
                    }
                })
        })

        $scope.tableParam={
            options:{
                // url:'/api/getAllCards',
                mobileResponsive:true,
                columns:[
                    {
                        field:'id',
                        title:'#',
                        cellStyle: function cellStyle(value, row, index, field) {
                            return {
                                classes:"bs-th",
                                css: {"max-width":"40px","width":"40px"}
                            };
                        }
                    },
                    {
                        field:'description',
                        title:'Description',
                        cellStyle: function cellStyle(value, row, index, field) {
                            return {
                                classes:"bs-th",
                                css: {"max-width":"115px"}
                            };
                        }
                    },
                    {
                        field:'updated',
                        title:'Updated Time',
                        sortable:true,
                        cellStyle: function cellStyle(value, row, index, field) {
                            return {
                                classes:"bs-th",
                                css: {"max-width":"85px","width":"85px"}
                            };
                        }
                    }
                ]
            }
        }

        $('#table').on('click-row.bs.table',function(event,row,element,field){
            dig = $mdDialog.show({
                controller:DialogController,
                template:
                `<md-content>
                    <md-toolbar class="md-hue-2" style="margin-bottom:5px">
                        <div class="md-toolbar-tools" style="display:flex;justify-content:space-between;">
                            <md-button class="md-icon-button" ng-click="close()">
                                <md-icon md-svg-icon="static/img/back.svg"></md-icon>
                            </md-button>
                            <h2 style="text-align:center">Modify Cards</h2>
                            <md-button ng-click="delete($event)" class="md-raised md-warn"  style="min-width:25px">
                                Delete
                            </md-button>
                            <md-button ng-click="save()" style="min-width:25px">
                                Save
                            </md-button>
                        </div>
                    </md-toolbar>
                    <card-modal card="card" tags="tags"></card-modal>
                </md-content>`,
                parent:angular.element(document.body),
                targetEvent:event,
                locals: {
                    card: row,
                    tags: $scope.tags
                },
            });
        })

        DialogController = function($scope, $mdDialog, card, tags, $element){
            $scope.card = card;
            $scope.tags = tags;
            $scope.close = function(){
                $mdDialog.hide();
            };

            $scope.delete = function(ev){
                const confirm = $mdDialog.confirm()
                .title('Are you sure to delete this card?')
                .textContent('This operation gonna be irreversable.')
                .targetEvent(ev)
                .multiple(true)
                .ok('Delete')
                .cancel('Cancel');

                $mdDialog.show(confirm)
                .then(
                    function(){
                        //delete
                        CardService.removeCard($scope.card.id).then(
                            function(result){
                                if(typeof(result.data) == "object" && 'error' in result.data){
                                    if(result.data.error == '535'){
            
                                    }
                                    return;
                                }
                                if(result.data == 'success')
                                    location.reload();
                                    angular.element(document.querySelector('.underscore')).addClass('right');
                            },
                            function(result){

                            }
                        )
                    },
                    function(){
                        //cancel
                    }
                )
            }

            $scope.save = function(){
                if($(".ng-invalid").length != 0){
                    showToast('Please dont contain comma in hints.')
                    return
                }
                let card = {
                    id:$scope.card.id,
                    desc:$scope.card.description,
                    hints:$scope.card.hints.map((value)=>encodeURIComponent(value)).join(','),
                    tag:$scope.card.tag.join(','),
                    anwser:$scope.card.anwser
                }
                CardService.updateCard(card).then(
                    function(result){
                        if(typeof(result.data) == "object" && 'error' in result.data){
                            if(result.data.error == '535'){
    
                            }
                            return;
                        }
                        if(result.data == 'success')
                            location.reload();
                            angular.element(document.querySelector('.underscore')).addClass('right');
                    },
                    function(result){
    
                    }
                )
            };

        }
    }
})