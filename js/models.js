var Evento = Backbone.Model.extend({
    idAttribute: 'id'
});

var EventoCollection = Backbone.Collection.extend({

    model: Evento,
    fetchComplete: 0,

    //url: "http://pelladeocio.com/appeventos",
    url: "https://apitest.pelladeocio.com/api/v1/eventos",
    
    //comparator: 'date',

});

var Follower = Backbone.Model.extend({
    idAttribute: 'id_follow',
    
    //urlRoot: "http://localhost/fuerteagenda_cms/appfollowers", 
    urlRoot: "http://pelladeocio.com/appfollowers", 
    
    
});
