angular.module('userApp').component('tagsTable',{
    templateUrl:'/template/directives/tagstable.html',
    controller:function($scope, CardService, $mdDialog, $mdToast){


        $scope.tableParam={
            options:{
                url:'/api/getAllTags',
                search:true,
                striped:true,
                mobileResponsive:true,
                searchAlign:'left',
                toolbarAlign:'right',
                pagination:true,
                toolbar:'#toolbar',
                pageSize:8,
                formatShowingRows:function (pageFrom, pageTo, totalRows) {
                    return ;
                },
                formatRecordsPerPage: function (pageNumber) {
                    return ;
                },
                columns:[
                    {
                        field:'desc',
                        title:'Description',
                    },
                    {
                        title:'Remove',
                        width:'20px',
                        align:'center',
                        formatter:function formatter(value, row, index, field) {
                            return  `<span class="remove"><img src='static/img/remove.svg'/></span>`;
                        },
                        events:{
                            'click .remove': function (e, value, row, index) {
                                const confirm = $mdDialog.confirm()
                                        .title('Are you sure to delete this tag?')
                                        .textContent('All the related cards will be removed too.')
                                        .targetEvent(e)
                                        .multiple(true)
                                        .ok('Delete')
                                        .cancel('Cancel');

                                        $mdDialog.show(confirm)
                                        .then(
                                            function(){
                                                //delete
                                                CardService.removeTag(row['id']).then(
                                                    function(result){
                                                        location.reload();
                                                        
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
                        
                        }
                    },

                ]
            }
        }

        $scope.refresh = function(){
            $('#tagTable').bootstrapTable('refresh');
        }

        $scope.addTag = function(ev){
            var confirm = $mdDialog.prompt()
                .title('Please input the tag.')
                .placeholder('Tag')
                .targetEvent(ev)
                .required(true)
                .clickOutsideToClose(true)
                .ok('Okay!')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function(tag) {
                CardService.addTag(tag.trim()).then(
                    function(result){
                        if(typeof(result.data) == "object" && 'error' in result.data){
                            if(result.data.error == '536'){
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
                                            <span class="md-toast-text" flex>Duplicate Tag!</span>
                                            <md-button ng-click="closeToast()">
                                                Close
                                            </md-button>
                                        </md-toast>
                                        `
                                    });
                            }
                            return;
                        }
                        if(result.data == 'success')
                            location.reload();
                    },
                    function(result){

                    }
                )
            }, function() {
                
            });
        }

    }
})