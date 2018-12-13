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
        getAllCards:function(tags){
            return $http.post('/api/getAllCards',{tags:tags});
        },
        createCard:function(card){
            return $http.post('/api/createCard',card);
        },
        removeCard:function(id){
            return $http.put('/api/deleteCard',id);
        },
        removeTag:function(id){
            return $http.delete(`/api/deleteTag?id=${id}`);
        },
        addTag:function(tag){
            return $http.post('/api/createTag',{tag:tag});
        }
    }
})