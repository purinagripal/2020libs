// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    HomeView.prototype.template = Handlebars.compile($("#home-tpl").html());
    EventoListItemView.prototype.template = Handlebars.compile($("#eventos-list-tpl").html());
    

    /* ---------------------------------- Local Variables ---------------------------------- */
    var slider = new PageSlider($('body'));
    
    window.historial = [""];
    window.notif_recibidas = 0; // cuando se inicia la app debe ser cero, sólo será 1 cuando se reciban notificaciones
    window.scrollHome = 0;
    window.scrollLocales = 0;
    window.scrollFavor = 0;
    window.scrollNuevos = 0;

    var homeView;
    var nuevosView;
    var localesView;
    var localDetailsView;

    var nuevosList;
    var eventosList = new EventoCollection();
    // cuando se completa el fetch pone la variable a 1
    eventosList.on('fcomplete', function(){
        eventosList.fetchComplete = 1;
        console.log('trigger fcomplete');
        //console.log(eventosList);
    });
   
   
    var AppRouter = Backbone.Router.extend({

        routes: {
            "":                     "home",
            "preferencias":         "preferencias",
            "favoritos":            "favoritos",
            "nuevos":               "nuevos",
            "nuevoevento/:id":      "nuevoeventoDetails",
            "categ/:id_cat":        "categoria",
            "zona/:id_ciudad":      "ciudad",
            "eventos/:id":          "eventoDetails",
            "locales":              "locales",
            "zona_loc/:id_ciudad":  "ciudadLocales",
            "local/:id":            "localDetails",
            "mapaLocal/:id":        "mapaLocal",
            "mapaEvento/:id":       "mapaEvento",
            "acerca":               "acerca"
        },
        
        

        home: function () {
            // Since the home view never changes, we instantiate it and render it only once
            if (!homeView) {
                // console.log('router entra en home');
                homeView = new HomeView({model: eventosList});
                eventosList.fetch({reset: true, 
                                    success: function() {
                                        alert('fetch success eventosList');
                                        console.log( 'fetch success eventosList' );                            
                                    },
                                    complete: function() {
                                        alert('fetch complete');
                                        console.log( 'router - fetch complete, oculta cargando' );
                                        console.log(eventosList);
                                        alert(JSON.stringify(eventosList));
                                        eventosList.trigger("fcomplete");
                                        
                                        // renderiza eventos una vez descargados
                                        homeView.cargarEventos();
                                    }
                });
            } else {
                // console.log('reusing home view');
                homeView.cargarEventos();
                homeView.delegateEvents(); // delegate events when the view is recycled
            }
            homeView.delegateEvents();
            
            // ANALYTICS
            if (typeof window.ga !== 'undefined') {
                window.ga.trackView('inicio');
            }
            
            slider.slidePage(homeView.$el);
            // lleva el scroll a la posicion guardada
            $('div.guiaeventos').scrollTop(window.scrollHome);
        },
        
    });

    
    // console.log("window.historial: "+window.historial);
    
    var router = new AppRouter();
    Backbone.history.start();
    
     // establecer el localStorage para eventos notificados si no existe
    if( !window.localStorage.getItem('ev_notif') ) {
        window.localStorage.setItem('ev_notif', '[]');
    }
    
    // si no están seleccionadas las preferencias de notificacion nos redirige
//    if( !window.localStorage.getItem('pref_categ') ) {
//        // console.log("navigate preferencias");
//        Backbone.history.navigate('preferencias', {trigger: true});
//    }
    
    // para probar el funcionamiento en local
    // eventosNotificados();
    

    /* --------------------------------- Event Registration -------------------------------- */

    $(document).ready( function() { console.log("document ready"); });
    
    // eliminar 300ms delay
//    document.addEventListener('DOMContentLoaded', function() {
//        FastClick.attach(document.body);
//    }, false);
    
    document.addEventListener("deviceready", onDeviceReady, false);
    
    // PhoneGap esta listo y ahora ya se pueden hacer llamadas a PhoneGap
    function onDeviceReady() {
        // console.log('onDeviceReady se ejecutó');
        // console.log(navigator);
        
        if (navigator.notification) { // Override default HTML alert with native dialog
            // window.alert = function (message) {
            //     navigator.notification.alert(
            //         message,    // message
            //         null,       // callback
            //         "Pella de Ocio", // title
            //         'OK'        // buttonName
            //     );
            // };
        }
        
        // Now safe to use device APIs
        document.addEventListener("backbutton", onBackKeyDown, false);
        document.addEventListener("resume", onResume, false);
        
        // iniciar ANALYTICS
        if (typeof window.ga !== 'undefined') {
            
            window.ga.startTrackerWithId('UA-38453012-7', 30);
            window.ga.trackView('inicia App');
            
        }
                
        //StatusBar.hide();
        

        //  --- NOTIFICACIONES PUSH
//        var push = PushNotification.init({
//            android: {
//                senderID: "41817165383",
//                sound: "false",
//                vibrate: "false"
//            },
//            ios: {
//                alert: "true",
//                badge: "false",
//                sound: "false"
//            },
//            windows: {}
//        });

        var push = PushNotification.init({
            android: {
                senderID: "41817165383"                
            },
            ios: {
                alert: "true",
                badge: "false",
                sound: "false"
            },
            windows: {}
        });
             
        push.on('registration', function(data) {   
            
            // comprobamos si tiene RegistrationId
            if( window.localStorage.getItem('reg_id') ){
                // ya esta guardado
                // alert("RegistrationId guardado en localstorage: "+window.localStorage.getItem('reg_id'));
                // console.log("RegistrationId guardado en localstorage: "+window.localStorage.getItem('reg_id'));
                // alert("recibido de gcm: "+data.registrationId);
                
                if( window.localStorage.getItem('reg_id') != data.registrationId ) {
                    // si ha cambiado lo guardamos DE NUEVO
                    saveRegistrationId(data.registrationId);
                }

            } else {
                // alert("registration id: "+data.registrationId);
                // console.log("registration id: "+data.registrationId);
                
                // lo guardamos por PRIMERA vez 
                saveRegistrationId(data.registrationId);
            }
        });

        push.on('notification', function(data) {
            
            eventosNotificados();
                        
            setTimeout( function(){ 
                push.finish(function() {
                    console.log('Success finish');
                }, function() {
                    console.log('Error finish');
                }, 'push-1');
            }, 9000);
            
        });

        push.on('error', function(e) {
            alert('Error de registro de notificación');
            // e.message
        });
        
        // para abrir en InAppBrowser
        window.open = cordova.InAppBrowser.open;
        
        // oculta splashscreen (mejor ponerlo en config.xml
        // navigator.splashscreen.hide();
        
    
    };
    
    
    function eventosNotificados() {
        console.log('eventos notificados funcion');

        // para verificarlo en la linea #222 app.js
        window.notif_recibidas = 1;
        
        var id_follow = window.localStorage.getItem('id_follow');
        // console.log('eventos notificados para id_follow='+id_follow);
        
        // crea una vista nueva
        nuevosView = new NuevosView();

        // reset historial
        window.historial = ['', 'nuevos'];
        // navega a 'nuevos eventos'
        Backbone.history.navigate('', {replace: true}); // por si ya estaba en nuevos
        Backbone.history.navigate('nuevos', {replace: true, trigger: true});
        
        $.ajax({
            // url de prueba
            url: 'http://pelladeocio.com/feventos/'+id_follow,
            //url: 'http://pelladeocio.com/app_feventos/'+id_follow,
            data: '',
            dataType: 'json',
            cache: false,
            contentType: false,
            //processData: false,
            type: 'POST',
            success: function(datares){
                console.log('success eventos notificados');
                console.log(datares);
                
                // guarda los eventos en LS (las notificaciones se sustituyen cada día)
                var eventos_notificados = datares; // data es un array
                window.localStorage.setItem('ev_notif', JSON.stringify(eventos_notificados));
                // para proximas vistas, se cargaran los eventos desde localStorage 
                
                // crea la coleccion con los eventos actualizados con la notificacion
                nuevosList = new EventoCollection(eventos_notificados);
                // y la vincula a la vista
                nuevosView.model = nuevosList;
                                
            },
            error: function(data){
                console.log("Error eventos notificados");
                // console.log(data);
            },
            complete: function(datares){
                console.log("complete eventos notificados");
                nuevosView.cargarEventos();
            }
        });
        
    };
     
    
    // guardamos el reg_ig en nuestro servidor
    function saveRegistrationId(registrationId) {
        
        // Guardamos en BBDD y si todo va bien se guarda tbn en localStorage
        
        // sistema operativo del dispositivo
        var sistema_disp;
        if (device.platform == 'android' || device.platform == 'Android') {
            sistema_disp = 'android';
        }
        if (device.platform != 'android' && device.platform != 'Android' && device.platform !='Win32NT') {
            sistema_disp = 'ios';
        }
        if(device.platform == 'Win32NT'){
            sistema_disp = 'wp8';
        }
        
        // modelo 
        var follower = new Follower();
        
        if( window.localStorage.getItem('id_follow') ){
            // si ya existe el follower
            // preparamos el modelo con los datos
            follower.set({id_follow: window.localStorage.getItem('id_follow'),
                        registration_id: registrationId,
                        sistema: sistema_disp});
            
        } else {
            // si no existe el follower
            // preparamos el modelo con los datos
            // sin id_follow se creará una nueva entrada
            follower.set({registration_id: registrationId,
                        sistema: sistema_disp});
        }
        
        // guardamos en el servidor
        // save genera POST /appfollowers
        follower.save(null, {
            success:function(model, response){
                //alert(model);
                // console.log("succes save");
                // console.log("model:");
                // console.log(model);
                // console.log("response:");
                // console.log(response);
        
                // lo guardamos en LocalStorage 
                window.localStorage.setItem('reg_id', registrationId);
                window.localStorage.setItem('id_follow', response.id_follow);
            },
            error: function(model, response) {
                console.log("Error follower save");
            },
            wait: true
        });
    };
    
    
    function onBackKeyDown() {
        // console.log("length del historial: "+window.historial.length);
        // si está en home, sale de la app
        if(window.historial.length == 1) {
            // console.log("sale de la app");
            navigator.app.exitApp();
            /*navigator.Backbutton.goHome(function() {
              // console.log('success background')
            }, function() {
              // console.log('fail background')
            });*/
        } else {
            // console.log("boton atras - no sale de la app");
            // console.log(window.historial);
        }
        
        // vuelve al home
        // reinicia historial
        window.historial = [""];
        
        Backbone.history.navigate('', {trigger: true});
    };
    
    // para actualizar la lista de eventos en iOS (nunca se cierra la app)
    function onResume() {
        console.log('on resume');
        
        // reiniciamos Scrolls
        window.scrollHome = 0;
        window.scrollLocales = 0;
        window.scrollFavor = 0;
        window.scrollNuevos = 0;
        
        // para que espere hasta que se haya cargado
        eventosList.fetchComplete = 0;
        
        // para reiniciar marcador de notificaciones
        window.notif_recibidas = 0; // cuando se inicia la app debe ser cero, sólo será 1 cuando se reciban notificaciones

        // actualizamos desde el servidor
        homeView.model.fetch({reset: true, 
                          success: function() {
                            console.log( 'fetch success' );                            
                          },
                          complete: function() {
                              //alert('fetch complete');
                              console.log( 'fetch complete del onresume' );
                               
                              // para notificaciones
                              eventosList.trigger("fcomplete");

                              // resetea
                              homeView.ciudad = 0;
                              homeView.categoria = 0;
                              
                              // renderiza eventos una vez descargados
                              homeView.cargarEventos();
                              homeView.render();
                          }
        });
        
    };
    

    /* ---------------------------------- Local Functions ---------------------------------- */

}());