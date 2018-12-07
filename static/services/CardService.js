angular.module('userApp').service('CardService',function($http){
    return {
        getNext:function(){
            return $http.get('/api/getNextCard',{cache:false});
        },
        getFirst:function(){
            return $http.get('/api/getFirstCard');
        },
        knowACard:function(card){
            return $http.put('/api/knowACard',{id:card.id});
        }
    }
})