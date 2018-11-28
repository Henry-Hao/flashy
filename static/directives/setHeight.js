myApp.directive('setHeight',function($window,$timeout){
    return {
        link:function(scope,element,attr){
            $timeout(function(){
                if(attr['setHeight'] == 'full')
                    element.css('height',$window.innerHeight+'px');
                else if(attr['setHeight'] == 'underToolbar')
                    element.css('height',$window.innerHeight - 56 + 'px')
            },0)
            
        }
    }
})