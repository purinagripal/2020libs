var EventoListItemView = Backbone.View.extend({

    render:function () {
        /*console.log('evento-model');
        console.log(JSON.stringify(this.model));*/
        $(this.el).html(this.template(this.model.toJSON()));
        
        // pone el icono de la categoria correspondiente
        var ico_categ;
        switch(this.model.attributes.id_categoria) {
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
        
        // cuando se cargue la imagen le añade la clase correspondiente (vertical u horizontal)
        var self = this;
        $('.cuadro .imagen img', this.el).on('load', function() { self.clase_imagen(this) });
        
        // console.log('id_evento de model en evento list: '+this.model.attributes.id_evento);
        
        // añade la clase q correponde a la categoria del evento
        //this.claseCategoria(this.model.attributes.id_categoria);   
        
        // si es notificacion la marca como tal
        this.mostrarNotificacion(this.model.attributes.id_evento);
        
        return this; // enable chained calls
    },
    
    mostrarNotificacion: function (id_evento) {
        var eventos_notificados = window.localStorage.getItem('ev_notif');
        eventos_notificados = JSON.parse(eventos_notificados);
        
        esNotif = 0;
        for (index = 0; index < eventos_notificados.length; index++) { 
            if( id_evento == eventos_notificados[index]['id_evento'] ) {
                esNotif = 1;
            }
        }
        // si es un evento notificado muestra la campana
        if( esNotif == 1 ) {
            $('.notif.fa-exclamation-circle', this.el).show();
        }
    },
    
//    claseCategoria: function (id_categoria) {
//        $('.row.cuadro', this.el).addClass('categ_'+id_categoria);
//    }
    
   
    
    clase_imagen: function (imagen) {
//        console.log(imagen);
//        console.log($('.cuadro .imagen img', this.el));
//        console.log(imagen.width);
//        console.log(imagen.height);
        // console.log( $('.cuadro .imagen', this.el).width() );
        // console.log( $('.cuadro .imagen', this.el).height() );
        
        var relac = imagen.width / imagen.height;

        // si la imagen es vertical (mas alta q ancha) 
        // y es bastante alta ( 80/100=0.8 ancho/alto del div
        if(relac < 0.8) { 
            $('.cuadro .imagen img', this.el).addClass('vertical'); 
        } else if ( relac < 1 ) {
            $('.cuadro .imagen img', this.el).addClass('vertical-entablet'); 
        }
        
        // redimensiona la imagen al cargar (al girar la pantalla no se redimensiona
//        if(imagen.width < imagen.height) { 
//            imagen.width = $('.cuadro .imagen', this.el).width();
//            imagen.height = $('.cuadro .imagen', this.el).height();
//        } else {
//            $('.cuadro .imagen img', this.el).addClass('horiz'); 
//        }
    }

    
});