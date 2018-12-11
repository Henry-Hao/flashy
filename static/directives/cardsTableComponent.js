angular.module('userApp').component('cardsTable',{
    templateUrl:'/template/directives/cardsTable.html',
    controller:function($scope, CardService, $mdDialog, $element, $rootScope){

        $scope.selectedTags = [];
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

        $scope.toggle = function(id){
            let idx = $scope.selectedTags.indexOf(id);
            if(idx == -1){
                $scope.selectedTags.push(id);
            } else {
                $scope.selectedTags.splice(idx,1);
            }

            if($scope.selectedTags.length == 0){
                if($scope.tags.length > 0)
                    $scope.selectedTags = new Array(1).fill($scope.tags[0].id);
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
                                css: {"max-width":"10px"}
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
                                css: {"max-width":"100px"}
                            };
                        }
                    }
                ]
            }
        }

        $('#table').on('click-row.bs.table',function(event,row,element,field){
            $mdDialog.show({
                controller:DialogController,
                templateUrl:'template/directives/editcard.html',
                parent:angular.element(document.body),
                targetEvent:event,
                locals: {
                    item: row,
                    tags: $scope.tags
                },
            });
        })

        DialogController = function($scope, $mdDialog, item, tags, $element){
            $scope.item = item;
            $scope.tags = tags;
            $scope.selectedTags = item.tag.split(',');
            $scope.searchTerm = "";

            if(typeof($scope.item.hints) == 'string')
                $scope.item.hints = $scope.item.hints.split(',').map((value)=>decodeURIComponent(value));
            $scope.close = function(){
                $mdDialog.hide();
            };

            $scope.add = function(){
                $scope.item.hints.push('');
            }

            $scope.remove = function(index){
                if($scope.item.hints.length == 1)
                    return;
                $scope.item.hints.splice(index,1);
            }

            $scope.clearSearchTerm = function(){
                $scope.searchTerm = "";
            }

            $scope.save = function(){
                let card = {
                    id:$scope.item.id,
                    desc:$scope.item.description,
                    hints:$scope.item.hints.map((value)=>encodeURIComponent(value)).join(','),
                    tag:$scope.selectedTags,
                    anwser:$scope.item.anwser
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
                    },
                    function(result){

                    }
                )
            };
        }
    }
})