angular.module('userApp').component('cardsTable',{
    templateUrl:'/template/directives/cardsTable.html',
    controller:function($scope, CardService, $mdDialog, $element){

        this.$onInit = function(){
            CardService.getAllTags().then(
                function(result){
                    $scope.tags = result.data;
                },
                function(result){
                    console.log('error');
                }
            );

            CardService.getAllCards().then(
                function(result){
                    $scope.cards = result.data;
                    // $("#table").bootstrapTable('refresh');
                },
                function(result){
                    console.log('error');
                }
            )
        }

        $scope.data = [
            {
                id:1,
                desc:'desc11111111111111111111111111111111111111111111111111111',
                tag:"1,2,3,4",
                hint:'hint1,hint2',
                anwser:'anwser1111',
                time:'2018-12-04'
            },
            {
                id:2,
                desc:'desc2',
                tag:"2",
                hint:'hint3,hint4',
                anwser:'anwser222',
                time:'2018-12-12'
            }
        ];


        
        $scope.tableParam={
            options:{
                url:'/api/getAllCards',
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

        showDialog = function(ev, row){
            $mdDialog.show({
                controller:DialogController,
                templateUrl:'template/directives/editcard.html',
                parent:angular.element(document.body),
                targetEvent:ev,
                locals: {
                    item: row,
                    tags: $scope.tags
                },
            });
        };

        $('#table').on('click-row.bs.table',function(event,row,element,field){
            showDialog(event, row);
        })

        DialogController = function($scope, $mdDialog, item, tags, $element){
            $scope.item = item;
            $scope.tags = tags;
            $scope.selectedTags = item.tag.split(',');
            $scope.searchTerm = "";

            if(typeof($scope.item.hints) == 'string')
                $scope.item.hints = $scope.item.hints.split(',')
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

            $element.find('input').on('keydown', function(ev) {
                ev.stopPropagation();
            });

            $scope.save = function(){
                let card = {
                    id:$scope.item.id,
                    desc:$scope.item.description,
                    hints:$scope.item.hints.join(','),
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