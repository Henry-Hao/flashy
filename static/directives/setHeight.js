myApp.directive('setHeight',function($window){
    return {
        link:function(scope,element,attr){
            if(attr['setHeight'] == 'full')
                element.css('height',$window.innerHeight+'px')
        }
    }
})