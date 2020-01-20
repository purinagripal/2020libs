var EventoView = Backbone.View.extend({

    initialize: function () {

    },

    render: function () {
        // descripcion: pasar de \r\n a <br>
        var descripcionBr = (this.model.attributes.descripcion + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ '<br>' +'$2');
        this.model.attributes.descripcionBr = descripcionBr;
        
        // Eventor.horario: pasar de \r\n a <br>
        if(this.model.attributes.horario) {
            var horarioBr = (this.model.attributes.horario + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ '<br>' +'$2');
            this.model.attributes.horarioBr = horarioBr;
        }
        
        // si el organizador no es admin le añado campo noAdmin
         if(this.model.attributes.Eventor.id_user != 1) {
            this.model.attributes.Eventor.noAdmin = 1;
        }
        
        
        this.$el.html(this.template(this.model.toJSON()));        
        this.datosModelo = this.model.attributes;
        // console.log(this.datosModelo);
        
        // si el evento era una notificacion, lo saca de la lista xq ya esta visto
        this.borrarNotificacion(this.datosModelo.id_evento);
        
        var div_canvas = $('#eve-map-canvas', this.el)[0];
        
        var myLatlng = new google.maps.LatLng(this.datosModelo.lat, this.datosModelo.long); 
        window.mapOptions = { 
            zoom: 17, 
            center: myLatlng,
            streetViewControl: false,
            //styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }]}],
            draggable: false
        }; 
        window.map = new google.maps.Map(div_canvas, window.mapOptions);
        window.marker = new google.maps.Marker({ 
            position: myLatlng, 
            map: window.map, 
            title: 'titulo'
        });
        
        // pone el icono de la categoria correspondiente
        var ico_categ;
        switch(this.datosModelo.id_categoria) {
            case '1':
                ico_categ = '<i class="fa fa-music"></i>';
                break;
            case '2':
                ico_categ = '<i class="fa fa-star"></i>';
                break;
            case '3':
                ico_categ = '<i class="fa fa-paper-plane"></i>';
                break;
            case '4':
                ico_categ = '<i class="fa fa-comment"></i>';
                break;
            case '5':
                ico_categ = '<i class="fa fa-bicycle"></i>';
                break;
            case '6':
                ico_categ = '<i class="fa fa-child"></i>';
                break;
            default:
                ico_categ = '<i class="fa fa-music"></i>';
        }
        $('.ico-categ', this.el).html(ico_categ);
        
        return this;
    },
    
    
    events: {
        "click .boton_inicio": "volver_inicio",
        "click .link_eventos": "volver_inicio",
        "click .link_locales": "ver_locales",
        "click .link_favoritos": "ver_favoritos",
        "click .link_prefer": "ver_prefer",
        "click .link_acerca": "ver_acerca",
        
        "click #eve-map-canvas": "ver_bigmap",
        "click .link_bigmap": "ver_bigmap",
        "click a.link_web": "ver_web",
        
        "click .boton_atras": "volver_atras",
        "click .menu_salir": "salir",
        
        "click .local_link": "ver_local"
    },
    
    
    
    ver_web: function (event) {
        var ref = cordova.InAppBrowser.open('http://'+this.datosModelo.web_link, '_blank');
    },
    
    
    ver_local: function (event) {
        var id_local = $(event.currentTarget).attr('data-id'); 
        
        // añade entrada al historial
        window.historial.push('local/'+id_local);
        // console.log("window.historial: "+window.historial);
        
        Backbone.history.navigate('local/'+id_local, {trigger: true});
    },
    
    // si el evento era una notificacion, lo saca de la lista xq ya esta visto
    borrarNotificacion: function (id_evento) {
        var eventos_notificados = window.localStorage.getItem('ev_notif');
        eventos_notificados = JSON.parse(eventos_notificados);
        
        esNotif = -1;
        for (index = 0; index < eventos_notificados.length; index++) { 
            if( id_evento == eventos_notificados[index]['id_evento'] ) {
                esNotif = index;
            }
        }
        
        // si es un evento notificado lo saca de la lista
        // y actualiza LS
        if( esNotif != -1 ) {
            eventos_notificados.splice(esNotif,1);
            window.localStorage.setItem('ev_notif', JSON.stringify(eventos_notificados));
        }
        /*función splice() , dos parámetros: el primero será el índice a partir del cual queremos borrar elementos y, el                    segundo, el número de elementos que queremos borrar a partir de la posición dada.*/
    },
    
    ver_bigmap: function (event) {
        // console.log('evento ver big map');
        // console.log(event);
        
        // añade entrada al historial
        window.historial.push('mapaEvento/'+this.datosModelo.id_evento);
        // console.log("window.historial: "+window.historial);

        Backbone.history.navigate('mapaEvento/'+this.datosModelo.id_evento, {trigger: true});
    },
    
    ///////////////////////////////////////
    //
    //    ENLACES DEL MENU SUPERIOR
    //
    
    ver_locales: function (event) {        
        // resetea el historial
        window.historial = ['', 'locales'];
        // console.log("window.historial: "+window.historial);
        
        //console.log(event);
        Backbone.history.navigate('locales', {trigger: true});
    },
    
    ver_favoritos: function (event) {        
        // reset historial
        window.historial = ['', 'favoritos'];
        // console.log("window.historial: "+window.historial);
        
        //console.log(event);
        Backbone.history.navigate('favoritos', {trigger: true});
    },
    
    ver_prefer: function (event) {        
        // reset historial
        window.historial = ['', 'preferencias'];
        // console.log("window.historial: "+window.historial);
        
        //console.log(event);
        Backbone.history.navigate('preferencias', {trigger: true});
    },
    
    ver_acerca: function (event) {        
        // reset historial
        window.historial = ['', 'acerca'];
        // console.log("window.historial: "+window.historial);
        
        //// console.log(event);
        Backbone.history.navigate('acerca', {trigger: true});
    },
    
    volver_inicio: function (event) {
        // resetea el historial
        window.historial = [""];
        // console.log("window.historial: "+window.historial);
        Backbone.history.navigate( "", {trigger: true} );
    },
    
    volver_atras: function (event) {
        // console.log("volver");
        
        // saca elemento del historial y vuelve al anterior
        window.historial.pop();
        // console.log("window.historial: "+window.historial);
        Backbone.history.navigate( window.historial[window.historial.length-1], {trigger: true} );
        
        //console.log(Backbone.history.location);
        //Backbone.history.history.back();
        // es lo mismo que:
        //window.history.back();
    },

    salir: function (event) {
        // console.log("SALIR");
        navigator.app.exitApp();
    }

});