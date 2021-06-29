$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});
    $(document).ready(function(){
      $(document).on('change','select[name=pais]',function(){
            var idPais = this.value;

            $('.localidadselect')
                .find('option')
                .remove()
                .end()
            ;$('.estado')
                .find('option')
                .remove()
                .end()
            ;
            $('#municipio')
                .find('option')
                .remove()
                .end()
            ;

            var url = "/direccionPaciente/getEstados";
            $.ajax({
                      method: "POST",
                      url: url,
                      data: { 
                        idPais : idPais,
                   }
                    })
                      .done(function( data ) {
                        $('.estado')
                            .find('option')
                            .remove()
                            .end()
                        ;
                        $.each( data, function( key, value ) {
                            $('.estado').append($('<option>', {
                                value: value.id,
                                text: value.nom_ent,
                                style: 'text-align:right'
                            }));
                        });

                      }).fail(function() {
                        swal(
                          'Error.',
                          'Existe un error con su sesión. Intente actualizando la página o cerrando y abriendo sesión. si el problema continúa reporte con soporte.',
                          'error'
                        )
                      });
        });
        $(document).on('change','select[name=estado]',function(){
            var idEstado = this.value;

            $('.localidadselect')
                .find('option')
                .remove()
                .end()
            ;
            $('#municipio')
                .find('option')
                .remove()
                .end()
            ;

            var url = "/direccionPaciente/getMunicipios";
            $.ajax({
                      method: "POST",
                      url: url,
                      data: { 
                        idEstado : idEstado,
                   }
                    })
                      .done(function( data ) {
                        $('.municipio')
                            .find('option')
                            .remove()
                            .end()
                        ;
                        $.each( data, function( key, value ) {
                            $('.municipio').append($('<option>', {
                                value: value.id,
                                text: value.nom_mun,
                                style: 'text-align:right'
                            }));
                        });

                      }).fail(function() {
                        swal(
                          'Error.',
                          'Existe un error con su sesión. Intente actualizando la página o cerrando y abriendo sesión. si el problema continúa reporte con soporte.',
                          'error'
                        )
                      });
        });


        //Script para jalar localidades

        $(document).on('change','select[name=municipio]',function(){
            var idMunicipio = this.value;
            var idEstado = $('select[name=estado]').val();

            var url = "/direccionPaciente/getLocalidades";
            $.ajax({
                      method: "POST",
                      url: url,
                      data: { 
                        idEstado : idEstado,
                        idMunicipio : idMunicipio
                   }
                    })
                      .done(function( data ) {
                        $('.localidadselect')
                            .find('option')
                            .remove()
                            .end()
                        ;
                        $.each( data, function( key, value ) {
                            $('.localidadselect').append($('<option>', {
                                value: value.id,
                                text: value.nom_loc,
                                style: 'text-align:right'
                            }));
                        });

                      }).fail(function() {
                        swal(
                          'Error.',
                          'Existe un error con su sesión. Intente actualizando la página o cerrando y abriendo sesión. si el problema continúa reporte con soporte.',
                          'error'
                        )
                      });
        });
    });


    $(document).ready(function(){
    $('.login-info-box').fadeOut();
    $('.login-show').addClass('show-log-panel');
});


$('.login-reg-panel input[type="radio"]').on('change', function() {
    if($('#log-login-show').is(':checked')) {
        $('.register-info-box').fadeOut(); 
        $('.login-info-box').fadeIn();
        
        $('.white-panel').addClass('right-log');
        $('.register-show').addClass('show-log-panel');
        $('.login-show').removeClass('show-log-panel');
        
    }
    else if($('#log-reg-show').is(':checked')) {
        $('.register-info-box').fadeIn();
        $('.login-info-box').fadeOut();
        
        $('.white-panel').removeClass('right-log');
        
        $('.login-show').addClass('show-log-panel');
        $('.register-show').removeClass('show-log-panel');
    }
});
  
