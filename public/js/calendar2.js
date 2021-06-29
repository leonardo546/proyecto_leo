
$(document).ready(function() {
    var SITEURL = window.location.origin;
    //var SITEURL = "{{url('/')}}";
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    /*$.ajax({
        url: SITEURL + '/comboespecialistas/usuarios',
        data: '',
        type: "POST",
        success: function (response) {
            for(i=0;i < response.length;i++){
            //alert(response[i].id);
            document.getElementById("inputFisioterapeuta").innerHTML += "<option value='"+response[i].id+"'>"+response[i].name+"</option>";
            }

        }
    });*/

    /*$('#inputPaciente').select2();
    $('#inputPacienteUpdate').select2();*/
    
 

    var calendar = $('#calendar').fullCalendar({
        locale: 'es',
        defaultView: 'month',
        header: {
            left: 'prev,next today',
            center: 'title',
            //right: 'month,agendaSixDay,agendaThreeDay,agendaDay,listMonth'
            right: 'month,agendaSixDay,agendaThreeDay,agendaDay'
        },
        aspectRatio: 1.65,
        // hiddenDays: [0, 6],
        weekends: false,
        nowIndicator: true,
        businessHours: false,
        views: {
            agendaSixDay: {
                type: 'agenda',
                duration: { days: 7 },
                buttonText: 'Cinco días',
                minTime: "08:00",
                maxTime: "22:00"
            },
            agendaThreeDay: {
                type: 'agenda',
                duration: { days: 3 },
                buttonText: 'Tres días',
                minTime: "08:00",
                maxTime: "22:00"
            },
            agendaDay: {
                minTime: "08:00",
                maxTime: "22:00"
            }
        },

        defaultDate: new Date(),

        editable: true,
        //events: SITEURL + "/fullcalendareventmaster",
        eventSources: [

            // your event source
            {
                url: SITEURL + '/fullcalendareventmaster/', // use the `url` property
                method: 'GET',
                data: function() {
                    
                    return {
                        especialistas: $('#ids_espesialistas').val(),
                        especialidades: $('#ids_espesialidades').val()
                    };
                },
                failure: function() {
                    alert('there was an error while fetching events!');
                },

                color: 'yellow', // an option!
                textColor: 'black' // an option!
            }

            // any other sources...

        ],
        eventBorderColor: '#000',
        displayEventTime: true,
        eventRender: function(event, element, view) {

            //Reemplazo de menú contextual par alos eventos
            //Desactivamos el menú contextual por defecto
            element.on("contextmenu", function(e) {
                e.preventDefault();
            });
            //Seteamos las opciones del menu contextual
            let optionsContextMenu = [
                [
                    {
                        text: "<i class='zmdi zmdi-accounts-alt'> " + event.title + "</i>",
                        action: function() {
                            eventClick(event, null, null, true);
                        }
                    },
                    {
                        text: "<i class='zmdi zmdi-label'> Estatus: " + event.nombre_estatus + "</i>"
                    },
                    {
                        text: "<i class='zmdi zmdi-money-box'> Saldo: "+ event.saldo + "</i>"
                    },
                    {
                        text: "<i class='zmdi zmdi-edit'> Editar cita </i>",
                        action: function (){
                            eventClick(event, null, null, false);
                            changeForm();
                        }
                    },
                    {
                        text: "<i class='zmdi zmdi-alert-polygon'> Cancelar cita </i>",
                        action: function (){
                            eventClick(event, null, null, false);
                            cancelarCita();
                        }
                    }
                ]
            ];
            //Enlazamos el elemento con el menú contextual y seteamos las opciones
            /*element.contextMenu(optionsContextMenu, {
                name: "menuEvent",
                offsetX: 5,
                // callbacks
                beforeShow: $.noop,
                afterShow: $.noop
            });*/


            element.css('color', 'black');
            if (event.estatus_id == 10 || event.estatus_id == 12) {
                element.css('background-color', '#ECE6E5');
                //agregando estilo de trama localizado en clinicAdmin/calendar/home
                element.addClass("bg-lineas-diagonales");
            }
            if (event.estatus_id == 5) {
                element.css('background-color', '#E5500B');
            } else {
                element.css('background-color', event.color_profesional);
            }

            if (event.allDay === 'true') {
                event.allDay = true;
            } else {
                event.allDay = false;
            }
        },
        selectable: false,
        selectHelper: true,

        /*select: function (start, end, allDay) {
            var title = prompt('Event Title:');


            if (title) {
                var start = $.fullCalendar.formatDate(start, "Y-MM-DD HH:mm:ss");
                var end = $.fullCalendar.formatDate(end, "Y-MM-DD HH:mm:ss");

                $.ajax({
                    url: SITEURL + "/fullcalendareventmaster/create",
                    data: 'title=' + title + '&start=' + start + '&end=' + end,
                    type: "POST",
                    success: function (data) {
                        displayMessage("Added Successfully");
                        $('#calendar').fullCalendar('removeEvents');
                        $('#calendar').fullCalendar('refetchEvents' );
                    }
                });
                calendar.fullCalendar('renderEvent',
                        {
                            title: title,
                            start: start,
                            end: end,
                            allDay: allDay
                        },
                true
                        );
            }
            calendar.fullCalendar('unselect');
        },*/

        eventDrop: function(event, delta) {
            var start = $.fullCalendar.formatDate(event.start, "Y-MM-DD HH:mm:ss");
            var end = $.fullCalendar.formatDate(event.end, "Y-MM-DD HH:mm:ss");
            console.log(event);
            $.ajax({
                url: SITEURL + '/fullcalendareventmaster/update',
                data: 'title=' + event.title + '&start=' + start + '&end=' + end + '&id=' + event.id + '&fisioterapeuta_id=' + event.fisioterapeuta_id + '&tipo_cita_id=' + event.tipo_cita_id + '&patient_id=' + event.patient_id + '&padecimiento_id=' + event.padecimiento_id + '&id_especialidad=' + event.id_especialidad + '&id_sesion=' + event.id_sesion + '&id_gabinete=' + event.id_gabinete + '&id_equipo_extra=' + event.id_equipo_extra + '&dolor_id=' + event.dolor_id + '&note=' + event.note,
                type: "POST",
                success: function(response) {
                    displayMessage("Updated Successfully");
                }
            });
        },

        /*eventClick: function (event) {
            var deleteMsg = confirm("Do you really want to delete?");
            if (deleteMsg) {
                $.ajax({
                    type: "POST",
                    url: SITEURL + '/fullcalendareventmaster/delete',
                    data: "&id=" + event.id,
                    success: function (response) {
                        if(parseInt(response) > 0) {
                            $('#calendar').fullCalendar('removeEvents', event.id);
                            displayMessage("Deleted Successfully");
                        }
                    }
                });
            }
        },*/

        eventClick: function(calEvent, jsEvent, view) {
            eventClick(calEvent);
        },

        dayClick: function(date, jsEvent, view) {
            var tiempon = timeNormal(date);

            $('#exampleModalCRUD').modal();
            $('#inputInicio').val(date.format('YYYY-MM-DD'));
            $('#inputFin').val(date.format('YYYY-MM-DD'));

            get_tiempo = new Date(new Date().toDateString() + ' ' + tiempon);

            $('#horaStart').val((moment.unix(get_tiempo / 1000).format("HH")));
            $('#horaEnd').val((moment.unix(get_tiempo / 1000).format("mm")));

            $('#timeStart').val(tiempon);
            $('#tituloModalCRUD').html('Nueva cita para el ' + moment(date).locale('es').format('LLLL'));
            f();
            h();
            restablecerCamposGuardar();

        }
    });
});

function recargarCalendario() {
    var SITEURLS = window.location.origin;

    var inicio = moment($('#calendar').fullCalendar('getView').start).format("YYYY-MM-DD");
    var fin = moment($('#calendar').fullCalendar('getView').end).format("YYYY-MM-DD");
    var arrayEspeciades = $('#ids_espesialidades').val();
    var arrayEspecialitas = $('#ids_espesialistas').val();
    var calendar = $("#calendar").fullCalendar();
    console.log('aiuenciyebnci');
    //alert("inicio : " + inicio + " fin : " + fin);
    //var eventosFiltrados = SITEURLS + '/fullcalendareventmaster/';

    /*$.ajax({
        url: SITEURLS + "/fullcalendareventmaster/",
        data: 'start=' + inicio + '&end=' + fin + '&especialistas=' + arrayEspecialitas + '&especialidades=' + arrayEspeciades,
        type: "GET",
        success: function(data) {
            console.log(data);
            calendar.fullCalendar('removeEvents');
            calendar.fullCalendar('addEventSource', data);
            calendar.fullCalendar('refetchEvents');

            /*toastr.info("Se agrego a la lista de espera", "Exito¡");
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('refetchEvents');
            $('#exampleModalCRUD').modal('toggle');
            restablecerCamposGuardar();
            alertaPago();
        }
    });*/


    /*var calendar = $("#calendar").fullCalendar({ events: eventosFiltrados });
    calendar.fullCalendar('refetchEvents');*/
    //calendar.fullCalendar('removeEvents');
    //calendar.fullCalendar('addEventSource', eventosFiltrados);
    calendar.fullCalendar('refetchEvents');
    $('#modalFiltrarAgenda').modal('toggle');
    //calendar2.fullCalendar('refetchEvents');
}

var arrayOptionEspd = [];
var arrayOptionEspesta = [];

function eventClick(calEvent, jsEvent, view, showDetail=true)
{
    if(showDetail){
        $('#modalDetalleCita').modal();
    }
    $('#tituloModalDetalle').html(calEvent.title);
    var starts = timeConvert(calEvent.start);
    var ends = timeConvertsmall(calEvent.end);
    $('#idEventDetalle').val(calEvent.id);
    $('#fechaDetalle').html(starts + ends);
    $('#especialistaDetalle').html(calEvent.fisioterapeuta);
    $('#telefonoDetalle').html(calEvent.celular);
    $('#correoDetalle').html(calEvent.email);
    $('#padecimientoDetalle').html(calEvent.nombre_especialidad);
    $('#sesionDetalle').html(calEvent.nombre_sesion);
    $('#notasDetalle').html(calEvent.note);
    $('#costoDetalle').html(calEvent.costo + ' €');
    if (calEvent.costo_extra == null) { $('#costoExtraDetalle').html('0 €'); } else { $('#costoExtraDetalle').html(calEvent.costo_extra + ' €'); }
    $('#detalleCostoExtraDetalle').html(calEvent.detalle_costo_extra);
    $('#detalleCostoTotal').html(calEvent.costo_total + ' €');

    $('#inputPacienteUpdate').val(calEvent.id_paciente);
    $('#inputPacienteautom').val(calEvent.title);
    $('#inputIdHidden').val(calEvent.id);
    $('#inputFisioterapeutaUpdate').val(calEvent.fisioterapeuta_id);
    $('#inputTipoCitaUpdate').val(calEvent.tipo_cita_id);
    //$('#inputPacienteUpdate').select2('data', {id: calEvent.patient_id, text: calEvent.title});

    $('#inputInicioUpdate').val(timeConvertNormal(calEvent.start)[0]);
    $('#timeStartUpdate').val(timeNormal(calEvent.start));
    $('#timeEndUpdate').val(timeNormal(calEvent.end));
    //alert("que onda qui ->:" + timeNormal(calEvent.end));
    $('#inputPadecimientoUpdate').val(calEvent.padecimiento_id);
    $('#inputSesionesUpdate').val(calEvent.id_sesion);
    $('#inputSesionesUpdate').append('<option selected value=' + calEvent.id_sesion + '>' + calEvent.nombre_sesion + '</option>');
    $('#inputGabineteUpdate').val(calEvent.id_gabinete);
    $('#inputEquipoExtraUpdate').val(calEvent.id_equipo_extra);
    //$('#inputNotasUpdate').val(calEvent.fisioterapeuta);
    $('#inputNotasUpdate').val(calEvent.note);
    $('#idCitaDetalle').val(calEvent.id);
    $('#numero_pacientem').html("Numero paciente #" + calEvent.folio);
    $('#isfromwitelist').val(0);


    /**
     * Limpieza de campos
     */
    $('#inputTemperatura').val("");
    $('#inputPresionArterial').val("");
    $('#inputEstatura').val("");
    $('#inputPeso').val("");
    $('#inputSatOxigeno').val("");
    var SITEURLS = window.location.origin;
    $.ajax({
        method: "POST",
        url: SITEURLS + "/get/Signos/Vitales",
        data: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            id: calEvent.id,
        }
    })
        .done(function(data) {
            console.log(data.signos);
            $('#inputTemperatura').val(data.signos.temperatura);
            $('#inputPresionArterial').val(data.signos.presion_arterial);
            $('#inputEstatura').val(data.signos.estatura);
            $('#inputPeso').val(data.signos.peso);
            $('#inputSatOxigeno').val(data.signos.presion_arterial);
        }).fail(function() {});
}

function gestionCheckEspd(op = null) {

    arrayOptionEspd = [];
    $(".form-check-input-especialidades").each(function() {
        var id = $(this).data('id');
        var id_op = "#op_especialidad_" + id;
        if ($(id_op).prop('checked')) {
            arrayOptionEspd.push(id);
            $('#ids_espesialidades').val(arrayOptionEspd);
        } else {
            var i = arrayOptionEspd.indexOf(id);
            if (i != -1) {
                arrayOptionEspd.splice(i, 1);
            }

            $('#ids_espesialidades').val(arrayOptionEspd);
        }
    });

}

function gestionCheckEspesta(op = null) {

    arrayOptionEspesta = [];

    $(".form-check-input-especialistas").each(function() {
        var id = $(this).data('id');
        var id_op = "#op_especialista_" + id;

        if ($(id_op).prop('checked')) {
            arrayOptionEspesta.push(id);
            $('#ids_espesialistas').val(arrayOptionEspesta);
        } else {
            var i = arrayOptionEspesta.indexOf(id);
            if (i != -1) {
                arrayOptionEspesta.splice(i, 1);
            }
            $('#ids_espesialistas').val(arrayOptionEspesta);
        }
    });

}

//Funcion para marcar o desmarcar todos los checkboxes de especialidad
$('#check_especialidades').click(function() {
    let lbl = document.getElementById('lbl_especialidades');

    if (this.checked) {
        lbl.innerText = 'Quitar todo';
        $('.form-check-input-especialidades').each(function() {
            // Si un input esta seleccionado, al hacer click lo deselecciona y viceversa.
            this.checked = true;
        });
    } else {
        lbl.innerText = 'Seleccionar todo';
        $('.form-check-input-especialidades').each(function() {
            // Si un input esta seleccionado, al hacer click lo deselecciona y viceversa.
            this.checked = false;
        });
    }

    gestionCheckEspd();

});

//Con esta funcion quito el checked de la casilla de 'todos' si alguno es desmarcado
$('.form-check-input-especialidades').on('click', function() {
    let lbl = document.getElementById('lbl_especialidades');

    if ($('.form-check-input-especialidades:checked').length == $('.form-check-input-especialidades').length) {
        $('#check_especialidades').prop('checked', true);
        lbl.innerText = 'Quitar todo';
    } else {
        $('#check_especialidades').prop('checked', false);
        lbl.innerText = 'Seleccionar todo';
    }
});

$('#check_especialistas').on('click', function() {
    let lbl = document.getElementById('lbl_especialistas');

    if (this.checked) {
        lbl.innerText = 'Quitar todo';
        $('.form-check-input-especialistas').each(function() {
            // Si un input esta seleccionado, al hacer click lo deselecciona y viceversa.
            this.checked = true;
        });
    } else {
        lbl.innerText = 'Seleccionar todo';
        $('.form-check-input-especialistas').each(function() {
            // Si un input esta seleccionado, al hacer click lo deselecciona y viceversa.
            this.checked = false;
        });
    }

    gestionCheckEspesta();

});

$('.form-check-input-especialistas').on('click', function() {
    let lbl = document.getElementById('lbl_especialistas');

    if ($('.form-check-input-especialistas:checked').length == $('.form-check-input-especialistas').length) {
        $('#check_especialistas').prop('checked', true);
        lbl.innerText = 'Quitar todo';
    } else {
        $('#check_especialistas').prop('checked', false);
        lbl.innerText = 'Seleccionar todo';
    }
});

function f() {
    var jkd = '';
    return go;
}

function h() {
    console.log("Hola");
}

function timeNormal(tiempo) {
    var tiempo = moment(tiempo).format("HH:mm");
    return tiempo;
}

function timeConvertNormal(unix_time) {
    var date = new Date(unix_time);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var convdataTime = year + '-' + ((month + 1) < 10 ? '0' + (month + 1) : (month + 1)) + '-' + (day < 10 ? '0' + (day) : day);
    var fechaTiempo = [];
    //fechaTiempo.push(convdataTime, ((hours < 10) ? '0' + hours : hours) + ':' + minutes.substr(-2));
    //alert("que onda aqui : " + timeNormal(date));
    fechaTiempo.push(convdataTime, timeNormal(date));
    return fechaTiempo;
}

function timeConvert(unix_time) {
    var months_arr = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    //alert("Fecha entrante "+ new Date(unix_time));
    var date = new Date(unix_time);
    var year = date.getFullYear();
    var month = months_arr[date.getMonth()];
    var day = date.getDate();

    /*var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();*/
    var hora = moment(unix_time).format("HH:mm");
    //var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    var convdataTime = day + ' de ' + month + ' del ' + year + ' de ' + hora;
    return convdataTime;
}

function timeConvertsmall(unix_time) {
    var months_arr = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    //alert("Fecha entrante "+ new Date(unix_time));
    var date = new Date(unix_time);
    var year = date.getFullYear();
    var month = months_arr[date.getMonth()];
    var day = date.getDate();

    /*var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();*/
    var hora = moment(unix_time).format("HH:mm");
    //var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    var convdataTime = ' a ' + hora;
    return convdataTime;
}

function displayMessage(message) {
    $(".response").css('display', 'block');
    $(".response").html("" + message + "");
    setInterval(function() { $(".response").fadeOut(); }, 4000);
}

function addWaitList() {
    /*var start = $.fullCalendar.formatDate(start, "Y-MM-DD HH:mm:ss");
      var end = $.fullCalendar.formatDate(end, "Y-MM-DD HH:mm:ss");*/
    var SITEURL = window.location.origin;

    var titulo = "Titulo";
    var fisiotera = $('#inputFisioterapeuta').val();
    var tipoCita = $('#inputTipoCita').val();
    var paciente = $('#inputPaciente').val();
    var fecha = $('#inputInicio').val();
    var tiemInicio = $('#timeStart').val();
    var tiempoFin = $('#timeEnd').val();
    var fechaInicio = fecha + " " + tiemInicio + ":00";
    var fechaFin = fecha + " " + tiempoFin + ":00";
    var padecimiento = $('#inputPadecimiento').val();
    var sesiones = $('#inputSesiones').val();

    var dolor = "1";
    var notas = $('#inputNotas').val();

    var costo = $('#costo_sesion').val();
    var costo_extra = $('#costo_extra').val();
    var inputDesExtras = $('#inputDesExtras').val();
    var costo_total = $('#costo_total').val();

    console.log('tipoCita', tipoCita);
    console.log('padecimiento', tipoCita);
    console.log('sesiones', padecimiento);
    console.log('fisiotera', sesiones);
    console.log('paciente', fisiotera);
    console.log('fecha', paciente);

    if (tiemInicio != '' && tiempoFin != '') {
        if (tipoCita != '' && padecimiento != '' && sesiones != '' && fisiotera != '' && paciente != '' && fecha != '') {
            if (costo_extra == '' && inputDesExtras == '' || costo_extra != '' && inputDesExtras != '') {
                if (noMenorCurrentDate()) {
                    $.ajax({
                        url: SITEURL + "/fullcalendareventmaster/createWaitList",
                        data: 'title=' + titulo + '&start=' + fechaInicio + '&end=' + fechaFin + '&fisioterapeuta_id=' + fisiotera + '&tipo_cita_id=' + tipoCita + '&patient_id=' + paciente + '&padecimiento_id=' + padecimiento + '&id_especialidad=' + padecimiento + '&id_sesion=' + sesiones + '&dolor_id=' + dolor + '&note=' + notas + '&costo_extra=' + costo_extra + '&inputDesExtras=' + inputDesExtras + '&costo_total=' + costo_total + '&costo=' + costo,
                        type: "POST",
                        success: function(data) {
                            toastr.info("Se agrego a la lista de espera", "Éxito¡");
                            $('#calendar').fullCalendar('removeEvents');
                            $('#calendar').fullCalendar('refetchEvents');
                            $('#exampleModalCRUD').modal('toggle');
                            restablecerCamposGuardar();
                            alertaPago();
                        }
                    });
                }
            } else if (costo_extra != '' && inputDesExtras == '') {
                toastr.warning("Por favor justifique el costo extra", "Justificar extras");
            }
        } else {
            toastr.warning("Por favor validar la información en lista de deseos", "Validar infomación");
        }
    } else {
        toastr.warning("Por favor validar la hora de la cita", "Validar hora");
    }
}


function addCita() {
    /*var start = $.fullCalendar.formatDate(start, "Y-MM-DD HH:mm:ss");
      var end = $.fullCalendar.formatDate(end, "Y-MM-DD HH:mm:ss");*/
    var SITEURL = window.location.origin;

    var titulo = "Titulo";
    var fisiotera = $('#inputFisioterapeuta').val();
    var tipoCita = $('#inputTipoCita').val();
    var paciente = $('#inputPaciente').val();
    var fecha = $('#inputInicio').val();
    var tiemInicio = $('#timeStart').val();
    var tiempoFin = $('#timeEnd').val();
    var fechaInicio = fecha + " " + tiemInicio + ":00";
    var fechaFin = fecha + " " + tiempoFin + ":00";
    var padecimiento = $('#inputPadecimiento').val();
    var origen_pasiente = $('#tipo_origen').val();
    var sesiones = $('#inputSesiones').val();
    var gabinete = $('#inputGabinete').val();
    var equipo_extra = $('#inputEquipoExtra').val();
    var dolor = "1";
    var notas = $('#inputNotas').val();

    var costo = $('#costo_sesion').val();
    var costo_extra = $('#costo_extra').val();
    var inputDesExtras = $('#inputDesExtras').val();

    var costo_descuento = $('#costo_descuento').val();
    var porcentaje_descuento = $('#porcentaje_descuento').val();
    var inputDescuento = $('#inputDesDescuento').val();

    var costo_total = $('#costo_total').val();

    console.log('paciente', paciente);
    console.log('tipoCita', tipoCita);
    console.log('padecimiento', tipoCita);
    console.log('sesiones', padecimiento);
    console.log('fisiotera', sesiones);
    console.log('paciente', fisiotera);
    console.log('fecha', paciente);

    if (tiemInicio != '' && tiempoFin != '') {
        if (tipoCita != '' && padecimiento != '' && sesiones != '' && fisiotera != '' && gabinete != '' && paciente != '' && fecha != '') {
            if (costo_extra == '' && inputDesExtras == '' || costo_extra != '' && inputDesExtras != '' || costo_descuento == '' && inputDescuento == '' || costo_descuento != '' && inputDescuento != '' || porcentaje_descuento == '' && inputDescuento == '' || porcentaje_descuento != '' && inputDescuento != '') {
                if (noMenorCurrentDate()) {
                    $.ajax({
                        url: SITEURL + "/fullcalendareventmaster/create",
                        data: 'title=' + titulo + '&start=' + fechaInicio + '&end=' + fechaFin + '&fisioterapeuta_id=' + fisiotera + '&tipo_cita_id=' + tipoCita + '&patient_id=' + paciente + '&padecimiento_id=' + padecimiento + '&id_especialidad=' + padecimiento + '&id_sesion=' + sesiones + '&id_gabinete=' + gabinete + '&id_equipo_extra=' + equipo_extra + '&dolor_id=' + dolor + '&note=' + notas + '&costo_extra=' + costo_extra + '&inputDesExtras=' + inputDesExtras + '&costo_total=' + costo_total + '&costo=' + costo + '&costo_descuento=' + costo_descuento + '&porcentaje_descuento=' + porcentaje_descuento + '&detalle_descuento=' + inputDescuento + '&origen_pasiente= ' + origen_pasiente,
                        type: "POST",
                        success: function(data) {
                            toastr.info("Cita programada exitosamente", "Éxito¡");
                            $('#calendar').fullCalendar('removeEvents');
                            $('#calendar').fullCalendar('refetchEvents');
                            $('#exampleModalCRUD').modal('toggle');
                            restablecerCamposGuardar();
                            alertaPago();
                        }
                    });
                }
            } else if (costo_extra != '' && inputDesExtras == '' || costo_descuento != '' && inputDescuento == '' || porcentaje_descuento != '' && inputDescuento == '') {
                toastr.warning("Por favor describa el ajuste", "Justificar extras");
            }
        } else {
            toastr.warning("Por favor validar la información en agregar cita", "Validar infomación");
        }
    } else {
        toastr.warning("Por favor validar la hora de la cita", "Validar hora");
    }
}

function updateCita() {

    var SITEURL = window.location.origin;

    var idCita = $('#inputIdHidden').val();

    var titulo = 'Titulo';
    var fisiotera = $('#inputFisioterapeutaUpdate').val();
    var tipoCita = $('#inputTipoCitaUpdate').val();
    var paciente = $('#inputPacienteUpdate').val();
    var fecha = $('#inputInicioUpdate').val();
    var tiemInicio = $('#timeStartUpdate').val();
    var tiempoFin = $('#timeEndUpdate').val();
    var fechaInicio = fecha + " " + tiemInicio + ":00";
    var fechaFin = fecha + " " + tiempoFin + ":00";
    var padecimiento = $('#inputPadecimientoUpdate').val();
    var sesion = $('#inputSesionesUpdate').val();
    var gabinete = $('#inputGabineteUpdate').val();
    var equipo_extra = $('#inputEquipoExtraUpdate').val();

    var dolor = 1;
    var notas = $('#inputNotasUpdate').val();
    var idFromWiteList = $('#isfromwitelist').val();
    console.log('paciente', paciente);
    console.log('tipoCita', tipoCita);
    console.log('padecimiento', tipoCita);
    console.log('sesiones', padecimiento);
    console.log('fisiotera', sesiones);
    console.log('paciente', fisiotera);
    console.log('fecha', paciente);


    if (tiemInicio != '' && tiempoFin != '') {
        if (tipoCita != '' && padecimiento != '' && sesion != '' && fisiotera != '' && gabinete != '') {
            $.ajax({
                url: SITEURL + '/fullcalendareventmaster/update',
                data: 'title=' + titulo + '&start=' + fechaInicio + '&end=' + fechaFin + '&fisioterapeuta_id=' + fisiotera + '&tipo_cita_id=' + tipoCita + '&patient_id=' + paciente + '&padecimiento_id=' + padecimiento + '&id_especialidad=' + padecimiento + '&id_sesion=' + sesion + '&id_gabinete=' + gabinete + '&id_equipo_extra=' + equipo_extra + '&dolor_id=' + dolor + '&note=' + notas + '&id=' + idCita + '&is_from_wite_list=' + idFromWiteList,
                type: "POST",
                success: function(response) {
                    toastr.info("Se modifico la cita exitosamente", "Éxito¡");
                    $('#calendar').fullCalendar('removeEvents');
                    $('#calendar').fullCalendar('refetchEvents');
                    $('#examplUpdate').modal('toggle');
                }
            });
        } else { toastr.warning("Por favor validar la información en actualizar cita", "Validar infomación"); }
    } else { toastr.warning("Por favor validar la hora de la cita", "Validar hora"); }

}

function cancelarCita() {
    var SITEURL = window.location.origin;
    var idCita = $('#idCitaDetalle').val();
    var deleteMsg = confirm("¿ Desea cancelar la cita ?");


    if (deleteMsg) {
        $.ajax({
            type: "POST",
            url: SITEURL + '/fullcalendareventmaster/delete',
            data: "&id=" + idCita,
            success: function(response) {
                if (parseInt(response) > 0) {
                    $('#calendar').fullCalendar('removeEvents', idCita);
                    displayMessage("Cita Cancelada correctamente");
                    $('#modalDetalleCita').modal('toggle');
                }

                location.reload();
            }
        });
    }
}

function changeForm() {
    $('#modalDetalleCita').modal('hide');
    $('#examplUpdate').modal();
    var fecha = $('#timeStartUpdate').val();
    fecha_total = new Date(new Date().toDateString() + ' ' + fecha);

    console.log(fecha_total.getHours());

    $('#horaStartUpdate').val((moment.unix(fecha_total / 1000).format("HH")));
    $('#horaEndUpdate').val((moment.unix(fecha_total / 1000).format("mm")));
}

function nuevoPaciente() {
    $('#form_registo_persona').show();
}

function nuevoPacientem() {
    $('#form_registo_personam').show();
}

function cancelarPersonExpres() {
    restablecerCamposExpres();
    $('#form_registo_persona').hide();
}

function cancelarPersonExpresm() {
    restablecerCamposExpresm();
    $('#form_registo_personam').hide();
}


function validaNumericos(event) {
    if (event.charCode >= 48 && event.charCode <= 57) {
        return true;
    }
    return false;
}

function validaCorreo() {
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var regOficial = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    campo = $('#inputCorreoExpres').val();

    if (reg.test(campo) && regOficial.test(campo)) {
        return true;
    } else if (reg.test(campo)) {
        return true;
    } else {
        return false;
    }
}

function validaCorreom() {
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var regOficial = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    campo = $('#inputCorreoExpresm').val();

    if (reg.test(campo) && regOficial.test(campo)) {
        return true;
    } else if (reg.test(campo)) {
        return true;
    } else {
        return false;
    }
}

function alertaPago() {
    alertify.confirm('Pagar la cita', '¿ Registrar el pago de la cita ?',
        function() {
            //TODO : llamar a la ventana de la pasarela de pago o registro de pago
        },
        function() {
            buttons: [{ text: "No", key: 27 /*Esc*/ }]
            alertify.error('El pago se registrará en otro momento')
        }).set('labels', { ok: 'Si', cancel: 'Registrar despues' });


}

function restablecerCamposExpres() {
    $('#inputNombreExpres').val('');
    $('#inputApPaternoExpres').val('');
    $('#inputApMaternoExpres').val('');
    $('#inputTelefonoExpres').val('');
    $('#inputCorreoExpres').val('');
    /*$('#inputPacienteauto').val('');
    $('#inputPaciente').val('');*/
    $('#tipo_origen').prop('selectedIndex', 0);
    $('#inputSexo').val('Masculino');



}

function restablecerCamposExpresm() {
    $('#inputNombreExpresm').val('');
    $('#inputApPaternoExpresm').val('');
    $('#inputApMaternoExpresm').val('');
    $('#inputTelefonoExpresm').val('');
    $('#inputCorreoExpresm').val('');
    $('#inputSexom').val('Masculino');
}

function restablecerCamposGuardar() {
    $('#timeStart').val('');
    $('#timeEnd').val('');
    $('#inputTipoCita').val('');
    $('#inputPadecimiento').val('');
    $('#inputSesiones').val('');
    $('#inputFisioterapeuta').val('');
    $('#inputGabinete').val('');
    $('#inputEquipoExtra').val('');
    $('#inputNotas').val('');
    $('#inputPacienteauto').val('');
    $('#inputPaciente').val('');
    $('#costo_extra').val('');
    $('#tipo_origen').val('');
    $('#inputDesExtras').val('');
    $('#costo_descuento').val('');
    $('#porcentaje_descuento').val('');
    $('#inputDesDescuento').val('');
    $('#costo_sesion').val('');
    $('#costo_total').val('');
    $('#tipo_descuento').val('');
    $('#inputFolioPacienteauto').val('');
    $('#numero_paciente').html('');
    $('#sesion_pago').html('');
    $("#costo_extra_div").hide();
    $("#inputDesExtras_dev").hide();
    $('#costo_descuento_dev').hide();
    $('#inputDesDescuento_dev').hide();

    $("#pasiente_label").css("color", "red");
    $("#labelTipocita").css("color", "red");
    $("#labelDiagnostico").css("color", "red");
    $("#labelSesiones").css("color", "red");
    $("#labelFisioterapeuta").css("color", "red");
    $("#labelNotas").css("color", "red");
    $("#labelEquipoExtra").css("color", "red");
    $("#labelGabinete").css("color", "red");
}

$('#contactForm').submit(function() {
    var SITEURL = window.location.origin;
    var nombre = $('#inputNombreExpres').val();
    var apPaterno = $('#inputApPaternoExpres').val();
    var apMaterno = $('#inputApMaternoExpres').val();
    var telefono = $('#inputTelefonoExpres').val();
    var correo = $('#inputCorreoExpres').val();
    var sexo = $('#inputSexo').val();
    var tipo_origen = $('#tipo_origen').val();
    var nombreCompleto = nombre + ' ' + ' ' + apPaterno + ' ' + apMaterno;


    if (correo !== '') {
        if (!validaCorreo()) {
            toastr.warning("Por favor validar el correo", "Validar correo");
            return false;
        }
    }

    if (nombre != '' && telefono != '' && apPaterno != '' && apMaterno != '') {
        $.ajax({
            url: SITEURL + "/Pacientes/pacientes",
            data: 'nombres=' + nombre + '&primer_apellido=' + apPaterno + '&segundo_apellido=' + apMaterno + '&email=' + correo + '&celular=' + telefono + '&sexo=' + sexo + '&tipo_origen=' + tipo_origen,
            type: "POST",
            success: function(data) {

                //Se consultan los datos del paciente recien agregado para mostrar los datos en el modal
                $.ajax({
                    url: `${SITEURL}/getNewestPatient`,
                    data: `nombres=${nombre}&primer_apellido=${apPaterno}&segundo_apellido=${apMaterno}`,
                    type: "GET",
                    success: function(response) {
                        console.log('ResSpuesta', response);
                        $('#inputPacienteauto').val(`${response.nombres} ${response.primer_apellido} ${response.segundo_apellido}`);
                        $('#inputPaciente').val(`${response.id}`);
                        $('#numero_paciente').html("Numero paciente #" + response.folio);
                    },
                    error: function() {
                        console.log("Error");
                    }
                });

                toastr.info("Ya puede citar con el nuevo paciente", "Éxito!");
                restablecerCamposExpres();
                $('#form_registo_persona').hide();

            }
        });
    } else if (nombre != '' && telefono != '' && apPaterno != '') {
        $.ajax({
            url: SITEURL + "/Pacientes/pacientes",
            data: 'nombres=' + nombre + '&primer_apellido=' + apPaterno + '&segundo_apellido=' + apMaterno + '&email=' + correo + '&celular=' + telefono + '&sexo=' + sexo + '&tipo_origen=' + tipo_origen,
            type: "POST",
            success: function(data) {

                //Se consultan los datos del paciente recien agregado para mostrar los datos en el modal
                $.ajax({
                    url: `${SITEURL}/getNewestPatient`,
                    data: `nombres=${nombre}&primer_apellido=${apPaterno}&segundo_apellido=${apMaterno}`,
                    type: "GET",
                    success: function(response) {
                        console.log('ResSpuesta', response);
                        $('#inputPacienteauto').val(`${response.nombres} ${response.primer_apellido}`);
                        $('#inputPaciente').val(`${response.id}`);
                        $('#numero_paciente').html("Numero paciente #" + response.folio);
                    },
                    error: function() {
                        console.log("Error");
                    }
                });

                toastr.info("Ya puede citar con el nuevo paciente", "Éxito!");
                restablecerCamposExpres();
                $('#form_registo_persona').hide();

            }
        });
    } else {
        toastr.warning("Por favor validar que el nombre o teléfono sean correctos", "Validar datos");
    }

    return false;
});

$('#contactFormm').submit(function() {
    var SITEURL = window.location.origin;
    var nombre = $('#inputNombreExpresm').val();
    var apPaterno = $('#inputApPaternoExpresm').val();
    var apMaterno = $('#inputApMaternoExpresm').val();
    var telefono = $('#inputTelefonoExpresm').val();
    var correo = $('#inputCorreoExpresm').val();
    var sexo = $('#inputSexom').val();



    if (correo !== '') {
        if (!validaCorreom()) {
            toastr.warning("Por favor validar el correo", "Validar correo");
            return false;
        }
    }

    if (nombre != '' && telefono != '' && apPaterno != '' && apMaterno != '') {
        $.ajax({
            url: SITEURL + "/Pacientes/pacientes",
            data: 'nombres=' + nombre + '&primer_apellido=' + apPaterno + '&segundo_apellido=' + apMaterno + '&email=' + correo + '&celular=' + telefono + '&sexo=' + sexo,
            type: "POST",
            success: function(data) {
                toastr.info("Ya puede citar con el nuevo paciente", "Éxito!");
                restablecerCamposExpresm();
                $('#form_registo_personam').hide();
            }
        });
    } else {
        toastr.warning("Por favor validar que el nombre o teléfono sean correctos", "Validar datos");
    }

    return false;
});

$('#signosVitalesForm').submit(function() {
    var SITEURL = window.location.origin;
    var id_cita = $('#idCitaDetalle').val();
    var temperatura = $('#inputTemperatura').val();
    var presion_arterial = $('#inputPresionArterial').val();
    var estatura = $('#inputEstatura').val();
    var peso = $('#inputPeso').val();
    var oxigeno = $('#inputSatOxigeno').val();


    //if (temperatura != '' && presion_arterial != '' && estatura != '' && peso != '' && oxigeno != '') {
    if (temperatura != '' && oxigeno != '') {
        $.ajax({
            url: SITEURL + "/signosvitales/save",
            data: 'id_cita=' + id_cita + '&temperatura=' + temperatura + '&presion_arterial=' + presion_arterial + '&estatura=' + estatura + '&peso=' + peso + '&oxigeno=' + oxigeno,
            type: "GET",
            success: function(data) {
                //$('#inputPacienteauto').val(nombre);
                toastr.info("Signos vitales registrados", "Éxito!");


            }
        });
    } else {
        toastr.warning("Por favor rellene los campos temperatura y Saturación de oxígeno", "Validar datos");
    }

    return false;
});

function vaciarPorcentaje() {
    var costo = $('#costo_sesion').val();
    $('#costo_total').val(costo);
    $('#porcentaje_descuento').val('');
}

function vaciarCantidad() {
    var costo = $('#costo_sesion').val();
    $('#costo_total').val(costo);
    $('#costo_descuento').val('');
}

function guardarPersonExpres() {
    var SITEURL = window.location.origin;
    var nombre = $('#inputNombreExpres').val();
    var apPaterno = $('#inputApPaternoExpres').val();
    var apMaterno = $('#inputApMaternoExpres').val();
    var telefono = $('#inputTelefonoExpres').val();
    var correo = $('#inputCorreoExpres').val();
    var sexo = $('#inputSexo').val();


    if (correo !== '') {
        if (!validaCorreo()) {
            toastr.warning("Por favor validar el correo", "Validar correo");
            return false;
        }
    }

    if (nombre != '' && telefono != '' && apPaterno != '' && apMaterno != '') {
        $.ajax({
            url: SITEURL + "/Pacientes/pacientes",
            data: 'nombres=' + nombre + '&primer_apellido=' + apPaterno + '&segundo_apellido=' + apMaterno + '&email=' + correo + '&celular=' + telefono + '&sexo=' + sexo,
            type: "POST",
            success: function(data) {
                toastr.info("Ya puede citar con el nuevo paciente", "Éxito!");
                restablecerCamposExpres();
                $('#form_registo_persona').hide();
            }
        });
    } else {
        toastr.warning("Por favor validar que el nombre o teléfono sean correctos", "Validar datos");
    }
}

function guardarPago(id) {
    alert("Pago registrado correctamente" + id);
}

function noMenorCurrentDate() {
    var dateCita = new Date($('#inputInicio').val());
    var currentDate = new Date();
    dateCita.setDate(dateCita.getDate() + 1);
    dateCita.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (dateCita.getTime() < currentDate.getTime()) {
        toastr.error("No es posible crear citas antes de la fecha actual", "Error");
        $('#inputInicio').val('');
        return false;
    } else { return true; }
}

function noMenorCurrentDatem() {
    var dateCita = new Date($('#inputInicioUpdate').val());
    var currentDate = new Date();
    dateCita.setDate(dateCita.getDate() + 1);
    dateCita.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (dateCita.getTime() < currentDate.getTime()) {
        toastr.error("No es posible crear citas antes de la fecha actual", "Error");
        $('#inputInicioUpdate').val('');
        return false;
    } else { return true; }
}

function noMenorCurrentTime() { //Validacion del tiempo  desde el tiempo actual
    var dateCita = new Date($('#inputInicio').val());
    var currentDate = new Date();
    dateCita.setDate(dateCita.getDate() + 1);
    dateCita.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (dateCita.getTime() <= currentDate.getTime()) {
        var horaCita = moment($('#timeStart').val(), 'h:mma');
        var currentTime = moment(new Date().getHours('HH') + ':' + new Date().getMinutes(), 'h:mma');
        if (horaCita < currentTime) {
            toastr.error("No es posible crear citas antes de la actual", "Error");
            $('#timeStart').val('');
            return false;
        } else { return true; }
    }
}

function noMenorCurrentTimem() {
    var dateCita = new Date($('#inputInicioUpdate').val());
    var currentDate = new Date();
    dateCita.setDate(dateCita.getDate() + 1);
    dateCita.setHours(0, 0, 0, 0);
    if (dateCita.getTime() < currentDate.getTime()) {
        var horaCita = moment($('#timeStartUpdate').val(), 'h:mma');
        var currentTime = moment(new Date().getHours('HH') + ':' + new Date().getMinutes(), 'h:mma');
        if (horaCita < currentTime) {
            toastr.error("No es posible crear citas antes de la actual", "Error");
            $('#timeStartUpdate').val('');
            return false;
        } else { return true; }
    }
}

function watchWiteList() {
    $('#rowsWaitList').html('');
    $.get('fullcalendareventmaster/waitlist/', function(response, state) {
        for (i = 0; i < response.length; i++) {
            $('#rowsWaitList').append('<tr><th scope="row">' + response[i].title + '</th> <td>' + response[i].start + '</td> <td>' + response[i].end + '</td> <td>' + response[i].fisioterapeuta + '</td><td>' + response[i].nombre_sesion + '</td> <td> <button data-toggle="tooltip" data-placement="top" title="Usar cita" class="btn btn-info" onclick="useAppointment(' + response[i].id + ');"><i class="zmdi zmdi-airplay"></i></button> <button class="btn btn-default" data-toggle="tooltip" data-placement="top" title="Eliminar cita" onclick="deleteEventWiteList(' + response[i].id + ');" ><i class="zmdi zmdi-delete zmdi-hc-2x"></i></button></td></tr>');
        }
    });
    //$('#exampleModalCRUD').modal('toggle');
    $('#modalWaitList').modal();
}

function buscarCitas() {
    $('#modalBuscarCita').modal();
}

function filtrarAgendas() {
    $('#modalFiltrarAgenda').modal();
}

asistio = document.getElementById('asistio');
no_asistio = document.getElementById('no_asistio');

asistio.addEventListener("click", function() {
    var SITEURL = window.location.origin;
    var idEvent = $('#idEventDetalle').val();
    $.ajax({
        url: SITEURL + "/fullcalendareventmaster/arrivePatient",
        data: 'id=' + idEvent,
        type: "POST",
        success: function(data) {
            toastr.info("Se ha iniciado la cita", "Éxito!");
            $('#modalDetalleCita').modal('toggle');
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('refetchEvents');
        }
    });
});

no_asistio.addEventListener("click", function() {
    var SITEURL = window.location.origin;
    var idEvent = $('#idEventDetalle').val();
    $.ajax({
        url: SITEURL + "/fullcalendareventmaster/didntArrive",
        data: 'id=' + idEvent,
        type: "POST",
        success: function(data) {
            toastr.info("La cita ahora esta en la lista de espera", "Éxito!");
            $('#modalDetalleCita').modal('toggle');
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('refetchEvents');
        }
    });
});

function useAppointment(id) {
    $.get('fullcalendareventmaster/waitlist/' + id, function(response, state) {
        $('#inputIdHidden').val(id);
        $('#inputPacienteautom').val(response[0].title);
        $('#inputTipoCitaUpdate').val(response[0].tipo_cita_id);
        $('#inputPacienteUpdate').val(response[0].id_paciente);
        $('#isfromwitelist').val(1);

        //$('#inputPadecimientoUpdate').val(response[0].padecimiento_id).change();


        //$('#inputSesionesUpdate').append('<option value="' + response[0].id_sesion + '">' + response[0].nombre_sesion + '</option>');

        $('#modalWaitList').modal('toggle');
        $('#examplUpdate').modal();
    });
}

function deleteEventWiteList(id) {
    $('#idCita').val(id);
    $('#modalWaitList').modal('toggle');
    $('#modalDeleteCita').modal();
}

function saveMotivoEliminacion() {

    var SITEURL = window.location.origin;
    var idEvent = $('#idCita').val();
    var motivo = $('#textAreaMotivoEliminacion').val();
    $.ajax({
        url: SITEURL + "/fullcalendareventmaster/saveMotivoEliminacion",
        data: 'id=' + idEvent + '&justificacion= ' + motivo,
        type: "POST",
        success: function(data) {
            toastr.info("Se ah eliiminado correctamente la cita", "Éxito!");
            $('#modalDeleteCita').modal('toggle');
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('refetchEvents');
        }
    });

}

function startBusquedaCita() {
    var SITEURL = window.location.origin;
    moment.locale('es');


    var fechaDesde = $('#fechaDesde').val();
    var fechaHasta = $('#fechaHasta').val();
    var tiempoDesde = $('#horaDesde').val();
    var tiempoHasta = $('#horaHasta').val();
    var especialidad = $('#inputEspecialidad').val();
    var especialista = $('#inputProfecionales').val();

    var rango = moment().range(fechaDesde, fechaHasta);
    //var diferencia = rango.diff('days');
    var arrayFechas = rango.toArray('days');
    var arrayFechasRango = [];

    var sTiempoInicio = parseInt(tiempoDesde.substring(0, 2));
    var sTiempoFin = parseInt(tiempoHasta.substring(0, 2));

    for (var i = 0; i < arrayFechas.length; i++) {
        for (var t = sTiempoInicio; t <= sTiempoFin; t++) {
            arrayFechasRango.push(moment(arrayFechas[i]).format("YYYY-MM-DD") + ' ' + (t < 10 ? '0' + t : t) + ':00:00');
        }
    }


    if (sTiempoInicio >= 7 && sTiempoFin <= 20) {
        var SITEURL = window.location.origin;
        $.ajax({
            type: "POST",
            url: SITEURL + "/buscaProcefionales/buscar",
            data: {
                /*"_token": '{{ csrf_token() }}',*/
                arregloFechas: arrayFechasRango,
                especialidad: especialidad,
                especialista: especialista

            },
            success: function(response) {
                $('#tablaResultCitas').show();
                $('#formConsulta').hide();
                $('#listadoFechas').html('');
                $.each(response, function() {
                    var fecha = Object.keys(this)[0];
                    var vFecha = this[fecha];
                    var detalle = Object.keys(this)[1];
                    var vDetalle = this[detalle];
                    $('#listadoFechas').append('<tr> ' + "<td>" + moment(vFecha).locale('es').format('LLLL') + '</td> <td>' + vDetalle.nombre_fisio + '</td><td>' + vDetalle.nombre_especialidad + '</td> <td><a onclick="nuevaCitaBuscaCita(' + vDetalle.especialidad_id + ',' + vDetalle.profesional_id + ',' + moment(vFecha).locale('es') + ');" class="btn btn-success">Seleccionar</a></td></tr> ');
                });
            }
        });
    } else {
        toastr.error("El horario consultado esta fuera del horario laboral", "Error");
    }
}

function buscaProfecionales(arrayFechasRango, arrayFechasOcupadas) {
    var SITEURL = window.location.origin;
    $.ajax({
        type: "POST",
        url: SITEURL + "/buscaProcefionales/buscar",
        data: {
            /*"_token": '{{ csrf_token() }}',*/
            arregloFechas: arrayFechasRango
        },
        success: function(response) {
            console.log("esta es la respuesta : " + arrayFechasOcupadas);

        }
    });
}


function arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) {
                a.splice(j--, 1);
            }
        }
    }
    return a;
};


function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function showFormSearchCita() {
    $('#tablaResultCitas').hide();
    $('#formConsulta').show();
}

function verFechas(arrayFechas) {
    alert("Estas son las fechas" + arrayFechas);
}

function getGabinetesBuscaCita(fecha, tiempoDesde, tiempoHasta) {
    var SITEURL = window.location.origin;
    var url = SITEURL + "/getAvailableGabinetes";
    let clinica_id = 1; //TODO Cambiar el id de la clinica en la que s esta logeado
    $('#timeStart').val(tiempoDesde);
    $('#timeEnd').val(tiempoHasta);
    var especialidad = $("#inputEspecialidad").val();
    //$("#inputPadecimiento").val(especialidad);

    //$('#inputPadecimiento option:eq(' + especialidad + ')').prop('selected', true);
    //$('#inputPadecimiento select').val(especialidad).trigger('change');

    cambioSelectEsp(especialidad);

    $.ajax({
            method: "POST",
            url: url,
            data: {
                /*"_token": '{{ csrf_token() }}',*/
                date: fecha,
                time_from: tiempoDesde,
                time_to: tiempoHasta,
                clinica_id: clinica_id
            }
        })
        .done(function(data) {
            if (data.length === 0) {
                console.log('No existen gabinetes disponibles para la fecha y la hora seleccionadas.');
            } else {
                $.each(data, function(key, item) {
                    //var fechaC = dateToYMD(new Date(fecha));

                    //$('#listadoFechas').append('<li onclick="nuevaCitaBuscaCita(' + moment(fecha, "YYYY-MM-DD") + ');">' + "Gabinete : " + fecha + '</li>');
                    $('#listadoFechas').append('<tr> ' + "<td>" + moment(fecha, 'YYYY-MM-DD').format('DD-MM-YYYY') + ' de ' + tiempoDesde + ' a ' + tiempoHasta + '</td> <td><a onclick="nuevaCitaBuscaCita(' + moment(fecha, 'YYYY-MM-DD') + ');" class="btn btn-success">Seleccionar</a></td></tr> ');
                    //console.log('Fecha Gabinete: ' + fecha + ' valor : ' + item.id + ' text : ' + item.nombre);
                });
            }

        }).fail(function() {
            console.log('Existe un error con su sesión. Intente actualizando la página o cerrando y abriendo sesión. si el problema continúa reporte con soporte.');
        });
}

function cambioSelectEsp(id) {
    $('#inputPadecimiento option:eq(' + id + ')').prop('selected', true);



    $.get('sesiones/' + id + '', function(response, state) {
        $('#inputSesiones').empty();
        $('#inputSesiones').append('<option value="">Seleccione el tratamiento</option>');
        for (i = 0; i < response.length; i++) {
            $('#inputSesiones').append('<option value=' + response[i].id + '>' + response[i].nombre + '</option>');
        }
    });

}

function dateToYMD(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    alert("Fecha recibida : " + (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y);
    return (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y;
}

function nuevaCitaBuscaCita(especialidad_id, profesional_id, fecha) {
    //console.log("Una hora  : " + moment.unix(fecha / 1000).format("HH:mm") + "Una fecha : " + moment.unix(fecha / 1000).format("DD-MM-YYYY"));
    $('#modalBuscarCita').modal('toggle');
    $('#timeStart').val(moment.unix(fecha / 1000).format("HH:mm"));
    $('#horaStart').val(moment.unix(fecha / 1000).format("HH"));
    $('#horaEnd').val(moment.unix(fecha / 1000).format("mm"));

    $('#inputInicio').val(moment.unix(fecha / 1000).format("YYYY-MM-DD"));
    $('#inputPadecimiento').val(especialidad_id);

    $.get('sesiones/' + especialidad_id + '', function(response, state) {
        $('#inputSesiones').empty();
        $('#inputSesiones').append('<option value="">Seleccione el tratamiento</option>');
        for (i = 0; i < response.length; i++) {
            $('#inputSesiones').append('<option value=' + response[i].id + '>' + response[i].nombre + '</option>');
        }

    });




    $('#inputSesiones').focusout(function() {
        $('#inputFisioterapeuta').val(profesional_id);
    });

    $('#tituloModalCRUD').html('Nuevo padecimiento para el ' + moment.unix(fecha / 1000).locale('es').format('LLLL'));
    $('#exampleModalCRUD').modal();
    sleep(2000);
    getEspecialistasSearch(moment.unix(fecha / 1000).format("YYYY-MM-DD"), moment.unix(fecha / 1000).format("HH:mm"), moment.unix((fecha + 60000) / 1000).format("HH:mm"), especialidad_id, profesional_id);

}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function getEspecialistasSearch(fecha, tiempoDesde, tiempoHasta, especialidad, profesional_id = null) {
    var SITEURL = window.location.origin;
    var url = SITEURL + "/especialista/disponibilidad";

    $.ajax({
            method: "POST",
            url: url,
            data: {

                date: fecha,
                time_from: tiempoDesde,
                time_to: tiempoHasta,
                especialidad_id: especialidad
            }
        })
        .done(function(data) {

            $("#inputFisioterapeuta option").remove();
            if (data.length === 0) {
                alert('No existen especialistas disponibles para la fecha y la hora seleccionadas.');

            } else {

                $.each(data, function(key, item) {
                    $('#inputFisioterapeuta').prepend($('<option>', {
                        value: item.id,
                        text: item.nombre
                    }));
                    if (!profesional_id) {
                        $("#inputFisioterapeuta option[value=" + item.id + "]").attr("selected", "selected");
                    }
                });

                if (profesional_id) {
                    $("#inputFisioterapeuta option[value=" + profesional_id + "]").attr("selected", "selected");
                }

            }

        }).fail(function() {

            alert('Existe un error con su sesión. Intente actualizando la página o cerrando y abriendo sesión. si el problema continúa reporte con soporte.');
            $('#cobrar_btn').removeAttr('disabled');
        });
}

function getEquiposBuscaCita(fecha, tiempoDesde, tiempoHasta) {
    var SITEURL = window.location.origin;
    var url = SITEURL + "/getAvailableEquipos";
    let clinica_id = 1; //TODO Cambiar el id de la clinica en la que s esta logeado
    $.ajax({
            method: "POST",
            url: url,
            data: {
                /*"_token": '{{ csrf_token() }}',*/
                date: fecha,
                time_from: tiempoDesde,
                time_to: tiempoHasta,
                clinica_id: clinica_id
            }
        })
        .done(function(data) {
            if (data.length === 0) {
                console.log('No existen equipos disponibles para la fecha y la hora seleccionadas.');

            } else {

                $.each(data, function(key, item) {
                    //console.log('Fecha Equipo: ' + fecha + ' valor : ' + item.id + ' text : ' + item.nombre);
                    //$('#listadoFechas').append('<li onclick="nuevaCitaBuscaCita(' + moment(fecha, "YYYY-MM-DD") + ');">' + "Equipos : " + fecha + '</li>');
                    $('#listadoFechasE').append("<tr> <td>Equipos : " + fecha + '</td></tr> ');
                });

            }

        }).fail(function() {
            console.log('Existe un error con su sesión. Intente actualizando la página o cerrando y abriendo sesión. si el problema continúa reporte con soporte.');
        });
}

function getEspecialistasBuscaCita(fecha, tiempoDesde, tiempoHasta, especialidad = null) {
    var SITEURL = window.location.origin;
    var url = SITEURL + "/especialista/disponibilidad";
    if (especialidad === null) {
        especialidad = $('#inputEspecialidad').val();
    }

    $.ajax({
            method: "POST",
            url: url,
            data: {
                /*"_token": '{{ csrf_token() }}',*/
                date: fecha,
                time_from: tiempoDesde,
                time_to: tiempoHasta,
                especialidad_id: especialidad
            }
        })
        .done(function(data) {
            if (data.length === 0) {
                console.log('No existen especialistas disponibles para la fecha y la hora seleccionadas.');


            } else {

                $.each(data, function(key, item) {
                    //console.log('Fecha fisioterapeuta: ' + fecha + ' valor : ' + item.id + ' text : ' + item.nombre);
                    //$('#listadoFechas').append('<li onclick="nuevaCitaBuscaCita(' + moment(fecha, "YYYY-MM-DD") + ');">' + "Especialista : " + fecha + '</li>');
                    $('#listadoFechasEs').append("<tr> <td>Especialista : " + fecha + '</td></tr>');
                    console.log('se actualiza');
                });

            }

        }).fail(function() {
            console.log('Existe un error con su sesión. Intente actualizando la página o cerrando y abriendo sesión. si el problema continúa reporte con soporte.');
        });
}


$('#inputSesiones').change(function(event) {
    $.get('sesiones/detalle/' + event.target.value + '', function(response, state) {
        var fechaInicioFull = $('#inputInicio').val() + ' ' + $('#timeStart').val()
        var fecha = new Date(fechaInicioFull);
        var minutos = fecha.getMinutes();
        fecha.setMinutes(minutos + response[0].duracion);
        var tiempo_to = (fecha.getHours() <= 9 ? "0" + fecha.getHours() : fecha.getHours()) + ":" + (fecha.getMinutes() <= 9 ? "0" + fecha.getMinutes() : fecha.getMinutes());
        updateTimeCita(tiempo_to);
        $('#timeEnd').val(tiempo_to);
        $('#costo_sesion').val(response[0].costo);
        calculaTotal();
    });
});

$('#inputSesionesUpdate').change(function(event) {
    $.get('sesiones/detalle/' + event.target.value + '', function(response, state) {
        var fechaInicioFull = $('#inputInicioUpdate').val() + ' ' + $('#timeStartUpdate').val()
        var fecha = new Date(fechaInicioFull);
        var minutos = fecha.getMinutes();
        fecha.setMinutes(minutos + response[0].duracion);
        var tiempo_to = (fecha.getHours() <= 9 ? "0" + fecha.getHours() : fecha.getHours()) + ":" + (fecha.getMinutes() <= 9 ? "0" + fecha.getMinutes() : fecha.getMinutes());
        updateTimeCitam(tiempo_to);
        $('#timeEndUpdate').val(tiempo_to);
        /*$('#costo_sesion').val(response[0].costo);
        calculaTotal();*/
    });
});

function calculaTotal() {
    var costo = parseInt($('#costo_sesion').val());
    var extra = parseInt($('#costo_extra').val());
    var total = (isNaN(extra) ? 0 : extra) + costo;
    $('#costo_total').val(total);
}

function calculaTotalDescunto() {
    var costo = parseInt($('#costo_sesion').val());
    var desc = parseInt($('#costo_descuento').val());
    var total = costo - (isNaN(desc) ? 0 : desc);
    $('#costo_total').val(total);

    if (total < 0) {
        toastr.error("El total no puede ser genativo", "Error");
        $('#costo_descuento').val('');
        $('#costo_total').val(costo);
    }
}

function calculaPorcentajeDescunto() {
    var costo = parseInt($('#costo_sesion').val());
    var pordesc = parseInt($('#porcentaje_descuento').val());
    var total = costo - (isNaN(pordesc) ? 0 : ((costo * pordesc) / 100));
    $('#costo_total').val(total);

    if (total < 0) {
        toastr.error("El total no puede ser genativo", "Error");
        $('#porcentaje_descuento').val('');
        $('#costo_total').val(costo);
    }
}

$('#inputPadecimientoUpdate').change(function(event) {
    $.get('sesiones/' + event.target.value + '', function(response, state) {
        $('#inputSesionesUpdate').empty();
        $('#inputSesionesUpdate').append('<option value="">Seleccione el tratamiento</option>');
        for (i = 0; i < response.length; i++) {
            $('#inputSesionesUpdate').append('<option value=' + response[i].id + '>' + response[i].nombre + '</option>');
        }
    });
});

$('#tipo_descuento').change(function(event) {
    var tipo = event.target.value;
    var costo_sesion = $('#costo_sesion').val();
    if (tipo == 1) {
        $("#costo_extra_div").show();
        $("#inputDesExtras_dev").show();

        $('#costo_descuento_dev').hide();
        $('#inputDesDescuento_dev').hide();

        $('#costo_descuento').val('');
        $('#porcentaje_descuento').val('');
        $('#inputDesDescuento').val('');
        $('#costo_total').val(costo_sesion);

    } else if (tipo == 2) {
        $('#costo_extra').val('');
        $('#inputDesExtras').val('');

        $("#costo_extra_div").hide();
        $("#inputDesExtras_dev").hide();

        $('#costo_descuento_dev').show();
        $('#inputDesDescuento_dev').show();
        $('#costo_total').val(costo_sesion);
    }

});

$('#inputPadecimiento').change(function(event) {
    $.get('sesiones/' + event.target.value + '', function(response, state) {
        $('#inputSesiones').empty();
        $('#inputSesiones').append('<option value="">Seleccione el tratamiento</option>');
        for (i = 0; i < response.length; i++) {
            $('#inputSesiones').append('<option value=' + response[i].id + '>' + response[i].nombre + '</option>');
        }
    });
});

$('#inputPadecimientoUpdate').change(function(event) {
    $.get('sesiones/' + event.target.value + '', function(response, state) {
        $('#inputSesionesUpdate').empty();
        $('#inputSesionesUpdate').append('<option value="">Seleccione el tratamiento</option>');
        for (i = 0; i < response.length; i++) {
            $('#inputSesionesUpdate').append('<option value=' + response[i].id + '>' + response[i].nombre + '</option>');
        }
    });
});

$('#inputSesiones').change(function(event) {
    var texto = $('#inputSesiones option:selected').text();
    $("#sesion_pago").html(texto);
});

$('#inputSesionesUpdate').change(function(event) {
    var texto = $('#inputSesionesUpdate option:selected').text();
    $("#sesion_pago_update").html(texto);
});

function cambioColorPaciente(id_label, id_componente) {
    var label = $('#' + id_componente).val();
    if (label != "") {
        $("#" + id_label).css("color", "black");
    } else {
        $("#" + id_label).css("color", "red");
    }
}

function limpiarFormNuevaCita() {
    restablecerCamposGuardar();
}

function verDetallePaciente() {
    var paciente_id = $('#inputPacienteUpdate').val();
    var SITEURL = window.location.origin;

    var url = SITEURL + '/Pacientes/pacientes/' + paciente_id;
    window.open(url, '_blank');
    return false;

}
