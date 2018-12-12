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
        },
        getAllTags:function(){
            return $http.get('/api/getAllTags',{cache:false});
        },
        updateCard:function(card){
            return $http.put('/api/updateCard',card);
        },
        getAllCards:function(){
            return $http.get('/api/getAllCards',{cache:false});
        },
        createCard:function(card){
            return $http.post('/api/createCard',card);
        },
        removeCard:function(id){
            return $http.put('/api/deleteCard',id);
        }
    }
})