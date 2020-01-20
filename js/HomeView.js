var HomeView = Backbone.View.extend({

    initialize:function () {
        // console.log('initialize de homeView');
        this.categoria = 0;
        this.ciudad = 0;
        
        this.$el.html(this.template());
        
        this.render();
    },

    render:function () {
        // console.log('render de homeView');
        // console.log(JSON.stringify(this.model));
                
        // boton categoria
        var categ_txt;
        switch(this.categoria) {
            case '1':
                categ_txt = 'Música';
                break;
            case '2':
                categ_txt = 'Espectáculos';
                break;
            case '3':
                categ_txt = 'Talleres';
                break;
            case '4':
                categ_txt = 'Encuentros';
                break;
            case '5':
                categ_txt = 'Deportes';
                break;
            case '6':
                categ_txt = 'Infantiles';
                break;
            default:
                categ_txt = 'Categoría';
        }
        this.$('#dropdownMenuCateg').html(categ_txt+' <span class="caret"></span>');
        
        // boton ciudad
        var ciudad_txt;
        switch(this.ciudad) {
            case '1':
                ciudad_txt = 'Antigua';
                break;
            case '2':
                ciudad_txt = 'Betancuria';
                break;
            case '3':
                ciudad_txt = 'La Oliva';
                break;
            case '4':
                ciudad_txt = 'Pájara';
                break;
            case '5':
                ciudad_txt = 'Tuineje';
                break;
            case '6':
                ciudad_txt = 'Puerto';
                break;
            
            default:
                ciudad_txt = 'Municipio';
        }
        this.$('#dropdownMenuCiudad').html(ciudad_txt+' <span class="caret"></span>');
                
        /*_.each(this.model.models, 
               function (evento) {$('.guiaeventos', this.el).append(new EventoListItemView({model: evento}).render().el);}, 
               this);*/
        return this;
    },

    events: {
        "click .link_locales": "ver_locales",
        "click .link_favoritos": "ver_favoritos",
        "click .link_nuevos": "ver_nuevos",
        "click .link_prefer": "ver_prefer",
        "click .link_acerca": "ver_acerca",
        "click .menu_salir": "salir",
        
        "click .row.cuadro": "ver_evento",
        "click .filt_categ": "filtra_categoria",
        "click .filt_zona": "filtra_ciudad"
    },
    
    cargarEventos: function () {
        
        console.log('cargar eventos');
        
        // resetea el div
        $('.guiaeventos', this.el).html('');
        
        // añade de nuevo los eventos
        _.each(this.model.models, 
               function (evento) {$('.guiaeventos', this.el).append(new EventoListItemView({model: evento}).render().el);}, 
               this);
        
        $('.cargando_eventos', this.el).hide();
        $('.eventos_cargados', this.el).show();
    },
    
    filtra_categoria: function (event) {
        var id_cat = $(event.currentTarget).attr('data-id'); 
        // console.log('id de categoria'+id_cat);
        
        //window.historial = "home";
        // console.log("window.historial: "+window.historial);
        
        Backbone.history.navigate('categ/'+id_cat, {trigger: true});
        // borra del historial
        Backbone.history.navigate('', {replace: true});
    },
    
    filtra_ciudad: function (event) {
        var id_ciudad = $(event.currentTarget).attr('data-id'); 
        // console.log('id de ciudad: '+id_ciudad);
        
        //window.historial = "home";
        // console.log("window.historial: "+window.historial);
        // borra del historial
        Backbone.history.navigate('zona/'+id_ciudad, {trigger: true});
        Backbone.history.navigate('', {replace: true});
    },
    
    ver_evento: function (event) {
        var id_evento = $(event.currentTarget).attr('data-id'); 
        // console.log("ver evento "+id_evento);
        
        // guarda la posicion del SCROLL en HOME para después volver al mismo lugar
        window.scrollHome = $('div.guiaeventos').scrollTop();
        
        // añade entrada al historial
        window.historial.push('eventos/'+id_evento);
        // console.log("window.historial: "+window.historial);
        
        //// console.log(event);
        Backbone.history.navigate('eventos/'+id_evento, {trigger: true});
    },
    
    ///////////////////////////////////////
    //
    //    ENLACES DEL MENU SUPERIOR
    //
    
    ver_locales: function (event) {        
        // reset historial
        window.historial = ['', 'locales'];
        // console.log("window.historial: "+window.historial);
        
        //// console.log(event);
        Backbone.history.navigate('locales', {trigger: true});
    },
    
    ver_favoritos: function (event) {        
        // reset historial
        window.historial = ['', 'favoritos'];
        // console.log("window.historial: "+window.historial);
        
        //// console.log(event);
        Backbone.history.navigate('favoritos', {trigger: true});
    },
    
    ver_prefer: function (event) {        
        // reset historial
        window.historial = ['', 'preferencias'];
        // console.log("window.historial: "+window.historial);
        
        //// console.log(event);
        Backbone.history.navigate('preferencias', {trigger: true});
    },
    
    ver_nuevos: function (event) {        
        // reset historial
        window.historial = ['', 'nuevos'];
        // console.log("window.historial: "+window.historial);
        
        //// console.log(event);
        Backbone.history.navigate('nuevos', {trigger: true});
    },
    
    ver_acerca: function (event) {        
        // reset historial
        window.historial = ['', 'acerca'];
        // console.log("window.historial: "+window.historial);
        
        //// console.log(event);
        Backbone.history.navigate('acerca', {trigger: true});
    },

    salir: function (event) {
        // console.log("SALIR");
        navigator.app.exitApp();
    }
});