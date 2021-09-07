
var isIE6 = ($.browser.msie && $.browser.version == "6.0");

  var estadoLogin = "usuario", bloqueaIngreso = false;

  function loginErrorHandler(result) {
  	var manejoEstandar = sfaObject.manejarError(result);
	  if(manejoEstandar){
		  estado.show(result.message, estado.tipo.ERROR);
		  
		  if(habilitarRecordarUsuario){
				 if ( isInformado(ConsultarUsuLStorage()) ){
					 setTimeout(function(){
						// location.reload();
						 ingresarRecordado();
						}, 2000);
					 
				 }else{
					 removerRecordar2();
					 setUserBoxRecordar();
				 }
		  }else{
			  showEstado("usuario");
		  }
	  }
  }

  function customValidation(){
      estado.show('Ingresando...', 'bien', false);
      return true;   
  }

  function onComplete(result) {
	  if (!result.response.data[0].nuevo) {
		  // Valido la derivacion con validacion
		  if(!result.response.data[1]){
			  if(result.response.data[0].tyc.mostrar) {
				  tecladoVirtualController.hideTecladoVirtual();
				  tycController.mostrartyc();
			  } else {
				  
				  /*if ($('#recordarme').is(':checked')){
					  RecordarUsuLStorage(result.response.data[0].aliasRecordarUsuario);
					  RecordarNombreRealLStorage(result.response.data[0].nombreReal); 
				  }*/
				  
				  $('#RedirectHomeForm').submit();
			  }
		  } else {
			  window.location = urlDerivacionConValidacion;
		  }
	  } else {
		  window.location = urlDatosPersonales;
	  }
  }
  
  function ingresar() {
	 
	  if (bloqueaIngreso){
		  return;
	  }	  
	  if (estadoLogin == "usuario") {
		  verificarUsuario();
	  } else if (estadoLogin == "ingresando"){
		  return;
	  } else {
		  showEstado("ingresando");
		  login();
	  }
  }
  
  function restauracionUsuario(url) {
	  $("#RestauracionUsuarioForm").attr("action", url);
	  $('#RestauracionUsuarioForm').submit();
  }
  
  function enrolamiento(url) {
	  $("#EnrolamientoForm").attr("action", url);
	  $('#EnrolamientoForm').submit();
  }
  
  function enrolamientoExterno() {
	  window.location = urlEnrolamientoExterno;
  }
  
 
  function login() {
  
  	  /*HB-37*/	    
	  if ($('#clave').val().length < 4 || $('#clave').val().length > 8) {
	      estado.show("Acceso incorrecto al Sistema", estado.tipo.ERROR);
		  showEstado("password");
		  return;
	  }
	 
	  if(false == sfaObject.validar()){
		  showEstado("sfaError");
		  return;
	  }	 
	  
	  $('#sfaInfo').val( sfaObject.generarSalida() );
	  
	  $('#username').val($('#usuario').val());
	  $('#pin').val($('#clave').val());
	  $('#usarTecladoVirtual').val($('#pcCompartida').attr('checked'));
	 
	  /* isRecordarUsuario */
	  if ($('#recordarme').is(':checked')){
		  $('#recordarUsuario').val('true');
		  
	  }else{
		  $('#recordarUsuario').val('false');  
	  }
	  
	  
	  $('#LoginForm').submit();
  }
  
  function verificarUsuario() {
	  if (!$('#usuario').valid()) {
		  /* Si el usuario no es valido y es un usuario recordado, se deja de recordar.*/
		  if(habilitarRecordarUsuario && isInformado(ConsultarUsuLStorage())){
			  aceptarOlvidar();
			  
		  }else{
			  estado.show("El nombre de usuario ingresado tiene un formato incorrecto, por favor ingr&eacute;selo nuevamente", estado.tipo.ERROR);
			  return;
		  }

	  }
	  estado.hide();
	  enviarFormVerificacion();
  }
  
  function enviarFormVerificacion() {
	 
	  bloquearIngreso();
	  var ajaxSubmitOptions = { success: onCompleteVerification , error: desbloquearIngreso};
	  $('#UserNameVerificationForm').ajaxSubmit(ajaxSubmitOptions);
  }
  
  function onCompleteVerification(result) {
	 
	  if (result.charAt(0) == "{") {
		  jsonResult = eval("result = " + result);
	
		  if(habilitarRecordarUsuario && isInformado(ConsultarUsuLStorage())){
			  setUserBoxRecordar();
			  return;
			  
		  }else{
			  if (result.response.message) {
				  estado.show(result.response.message, estado.tipo.ERROR);
			  }
			  return;
		  }	
	  }
	  $('#secondstep').html(result);
	  $('.avatar img').attr("src", avatarPath);
	  
	  /* Mostrar modal tyc recordar usuario */
	  if ($('#recordarme').is(':checked')){
		  modalController.showModal("#aceptarTycOlvidarUsu");
		  
	  }else{
		  if(habilitarRecordarUsuario && isInformado(ConsultarUsuLStorage())){
			 $("#divDarBienvenida").show();
				 
			 $("#loginBox").addClass("loginRecordado");
			 $("#divRegistrarse").addClass("registrarseRecordado");
			 $("#divLogo").addClass("bienvenidoRecordado");
			 $("#campoPassword").addClass("campoPasswordRecordado");
			 $("#divCampos").addClass("camposRecordado");
			 $("#contAvatar").addClass("avatarRecordado");
			 $("#loginInfoId").addClass("loginInfoIdRecordado");
			 $("#usuario").addClass("inputUsuRecordado");
			 $("#divIngreso").addClass("ingresoRecordado");
			 $("#divCuerpo").addClass("cuerpoRecordado");
			 $("#divSiEsPcPublica").addClass("esPcPublicaRecordado");
			 $("#cdor_recuperar_usu").addClass("recuperacion_usuario_recordado");
		  }

		  showEstado("password");
		  
	 	  sfaObject.inicializar();
	 	  desbloquearIngreso(); 
	  }
  }
  
  function cancelarRecordarUsu(){
	  $('#recordarme').attr('checked', false);
	  desbloquearIngreso();
	  modalController.hideModal("#aceptarTycOlvidarUsu");
  }
  
  function aceptarRecordarUsu(){
	  modalController.hideModal("#aceptarTycOlvidarUsu");
	  showEstado("password");
	  
 	  sfaObject.inicializar();
 	  desbloquearIngreso();
  }
  
  function bloquearIngreso(){
	  bloqueaIngreso = true;
	  $(".btn_ingresar").attr("disabled",true);
  }
  
  function desbloquearIngreso(){
	  
	  bloqueaIngreso = false;
	  $(".btn_ingresar").attr("disabled",false);
  }
  
  function showEstado(estado) {
	$('div.textoClave').hide();
	estadoLogin = estado;
	if (estado == "usuario") {
		$('#campoUsuario').show();
		$('#campoPassword').hide();
		$('#usuario').focus();
		$('#usuario').select();
		$('#usuario').attr("value", "");
		if (usarTecladoVirtual) {
			$('.siEsPcPublica').hide();
			$('#osk').hide();
		}
		sfaObject.ocultar();

	} else if (estado == "password") {
		$('#campoUsuario').hide();
		
		/* Insertamos las clases css para el box de ingreso de contraseñas si la funcionalidad recordar usuario está habilitada y el usuario no esta recordado */
		if(habilitarRecordarUsuario && !isInformado(ConsultarUsuLStorage()) ){
			 $("#divRegistrarse").removeClass("registrarseRecordar");
			 $("#divRegistrarse").addClass("registrarseRecordar2");
			 
			 $("#loginBox").removeClass("loginRecordar");
			 $("#loginBox").addClass("loginRecordar2");
			 
			 $("#campoPassword").removeClass("campoPasswordRecordar");
			 $("#campoPassword").addClass("campoPasswordRecordar2");
			 
			 $("#divCampos").removeClass("camposRecordar");
			 $("#divCampos").addClass("camposRecordar2");
			 
			 $("#divLogo").removeClass("bienvenidoRecordar");
			 $("#divLogo").addClass("bienvenidoRecordar2");
			 
			 $("#contAvatar").removeClass("avatarRecordar");
			 $("#contAvatar").addClass("avatarRecordar2");
			 
			 $("#loginInfoId").removeClass("loginInfoIdRecordar");
			 $("#loginInfoId").addClass("loginInfoIdRecordar2");
			 
			 $("#usuario").removeClass("inputUsuRecordar");
			 $("#usuario").addClass("inputUsuRecordar2");
			 
			 $("#divIngreso").removeClass("ingresoRecordar");
			 $("#divIngreso").addClass("ingresoRecordar2");
			 
			 $("#divCuerpo").removeClass("cuerpoRecordar");
			 $("#divCuerpo").addClass("cuerpoRecordar2");
			 
			 $("#divSiEsPcPublica").removeClass("esPcPublicaRecordar");
			 $("#divSiEsPcPublica").addClass("esPcPublicaRecordar2");
			 
			 $("#campoUsuario").removeClass("campoUsuarioRecordar");
			 $("#campoUsuario").addClass("campoUsuarioRecordar2");
			 
			 $("#cdor_recuperar_usu").removeClass("recuperacion_usuario_recordar");
			 $("#cdor_recuperar_usu").addClass("recuperacion_usuario_recordar2");
			 
		}
		
		$('#loginBox').show();/* recordar usu */
		
		$('#campoPassword').show();
		$('#clave').focus();
		$('#clave').select();
		$('#clave').attr("value", "");
		if (usarTecladoVirtual) {
			$('.siEsPcPublica').show();
			if ($('#pcCompartida').attr('checked')) {
				$('#osk').show();
			}
		}
	}
  }
  
function userNameOnKeyDown(event) {
	if (event.which || event.keyCode) {
		if ((event.which == 13) || (event.keyCode == 13))	
			verificarUsuario();
	}
}

function mostrarTecladoVirtual() {
	if (usarTecladoVirtual) {
		tecladoVirtualController.crearTecladoVirtual('#clave', 'body', '#contenedor', true);
		$('#pcCompartida').click(function() {
			if($(this).attr('checked')){
				ingresoConTecladoVirtual = true;
				tecladoVirtualController.showTecladoVirtual();
				$('#clave').attr('readonly','true');
			} else {
				tecladoVirtualController.hideTecladoVirtual();
				ingresoConTecladoVirtual = false;
				$('#clave').attr('readonly','');
			}
		});
		$('#clave').attr('readonly','');
	} else {
		$('.siEsPcPublica').hide();
	}
}

function addValidators() {
	var config = {"messages":{"username":{"required":"Debe completar este campo","rangelength":"El tama&ntilde;o debe ser entre 6 y 15"},"pin":{"required":"Debe completar este campo","regexp":"El valor ingresado no es v&aacute;lido","rangelength":"El tama&ntilde;o debe ser de 6 a 8"}},"rules":{"username":{"required":true,"rangelength":[6,15]},"pin":{"required":true,"regexp":"^[a-zA-Z0-9!\"#$%&/()=?¡¿\\-,;.:\\[\\]{}^]+$","rangelength":[6,8]}}, 
		"showErrors": function() {} };
	$('#UserNameVerificationForm').validate(config);
}

function isInformado(str){
	if (typeof str != "undefined") {
	    if(str != null && str != ""){
	    	return true;
	    }
	}
	return false;
	
}

function ConsultarUsuLStorage(){
	var usuarioLogin =  localStorage.getItem("usuarioRememberme" + fiidEntidad);
	
	return usuarioLogin;
}

function ConsultarNombreRealLStorage(){
	var nombreReal = localStorage.getItem("nombreRealRememberme" + fiidEntidad);
	
	return nombreReal;
}

function OlvidarUsuLStorage(){
	olvidarUsuario();
}

/* FUNCIONES MODAL OLVIDAR USUARIO */
function olvidarUsuario(){
	$('#olvidarUsuario').show();
	$('#jqmOverlay').show();
}
function cancelarOlvidar(){
	/* Cerrar popup */
	$('#olvidarUsuario').hide();
	$('#jqmOverlay').hide();
}
function aceptarOlvidar(){
	localStorage.removeItem("usuarioRememberme" + fiidEntidad);
	localStorage.removeItem("nombreRealRememberme" + fiidEntidad);
	location.reload();
}

function capitalizar(palabra){
	if (typeof palabra !== 'string') return ''
	  return palabra.charAt(0).toUpperCase() + palabra.slice(1)
}

function setUserBoxRecordar(){
	$(".ctdorCkeckRecordar").show();
	 /* Se agregan las clases para el box de ingreso de usuario */
	 $("#loginBox").addClass("loginRecordar");
	 $("#divRegistrarse").addClass("registrarseRecordar");
	 $("#campoPassword").addClass("campoPasswordRecordar");
	 $("#divCampos").addClass("camposRecordar");
	 $("#divLogo").addClass("bienvenidoRecordar");
    $("#contAvatar").addClass("avatarRecordar");
	 $("#loginInfoId").addClass("loginInfoIdRecordar");
	 $("#usuario").addClass("inputUsuRecordar");
	 $("#divIngreso").addClass("ingresoRecordar");
	 $("#divCuerpo").addClass("cuerpoRecordar");
	 $("#divSiEsPcPublica").addClass("esPcPublicaRecordar");
	 $("#campoUsuario").addClass("campoUsuarioRecordar");
	 $("#cdor_recuperar_usu").addClass("recuperacion_usuario_recordar");

	 $('#loginBox').show();
	 
	 showEstado("usuario");
}

function removerRecordar2(){
	 $("#divRegistrarse").removeClass("registrarseRecordar2");
	 $("#loginBox").removeClass("loginRecordar2");
	 $("#campoPassword").removeClass("campoPasswordRecordar2");
	 $("#divCampos").removeClass("camposRecordar2");
	 $("#divLogo").removeClass("bienvenidoRecordar2");
	 $("#contAvatar").removeClass("avatarRecordar2");
	 $("#loginInfoId").removeClass("loginInfoIdRecordar2");
	 $("#usuario").removeClass("inputUsuRecordar2");
	 $("#divIngreso").removeClass("ingresoRecordar2");
	 $("#divCuerpo").removeClass("cuerpoRecordar2");
	 $("#divSiEsPcPublica").removeClass("esPcPublicaRecordar2");
	 $("#campoUsuario").removeClass("campoUsuarioRecordar2");
	 $("#cdor_recuperar_usu").removeClass("recuperacion_usuario_recordar2");
	 
}

/* FUNCIONES MODAL ACEPTAR TYC PARA RECORDAR USUARIO */


function ingresarRecordado(){
	/* Seteamos los css*/
//	 $(".ayuda2").hide();
	 $("#holaSpan").html("&iexcl;Hola! " + capitalizar(ConsultarNombreRealLStorage()));
	 $("#noSoySpan").html("No soy " + capitalizar(ConsultarNombreRealLStorage()));

	 $('div.textoClave').hide();
	 $('#campoUsuario').hide();
	 estadoLogin = "usuario";
	 $('#campoPassword').hide();
	 
	 if (usarTecladoVirtual) {
		 $('.siEsPcPublica').hide();
		 $('#osk').hide();
	 }
	sfaObject.ocultar();
	/* informar el input usuario con el usu del local storage */
	$('#usuario').val(ConsultarUsuLStorage())
	ingresar();
}
//cerrarEnlacesModalLogin



$(function() {
	 //LINKI-5932: Parametrizar bloqueo de IE 6
	 var sps = servicePackBloqueadosIE6.split('|');
	 for (i = 0; i < sps.length; i++) {
		 if(isIE6 && navigator.appMinorVersion.match('SP' + sps[i])) {
			 var isIE6SP1 = isIE6 && navigator.appMinorVersion.match('SP1');
			//LINKI-6300: Parametrizar lista de ips sin bloqueo para IE6 SP1
			 if(isIE6SP1) {
				 if(!ipSinRestriccionIE6SP1) {
					 window.location = urlBrowserError;
				 }
			 } else {
				 window.location = urlBrowserError;
			 }
		 }
	 }
	
	 mostrarTecladoVirtual();

	 if(habilitarRecordarUsuario){
		 if ( isInformado(ConsultarUsuLStorage()) ){
			 ingresarRecordado();
	 		
		 }else{
			 setUserBoxRecordar();
		 }
		 
	 }else{
		 $('#loginBox').show();
		 showEstado("usuario");
	 }
 
	 $('#cerrarAceptarTycOlvidarUsu').click(function(){
		 modalController.hideModal("#aceptarTycOlvidarUsu");
		 desbloquearIngreso();
	 });
	 
	 $('#recordarme').click(function() {
		 if(!isInformado($('#usuario').val())){
			 $('#usuario').focus();
		 }
	 });
	 
	 $('div.textoClave').hide();
	 // Se comenta ya que se encuentra asociado en login.jsp el evento keydown
	 //$('#usuario').keydown(userNameOnKeyDown);
	 $('#clave').focus(function(){
		 var size = $(this).val().length;
	     $(this).caret(size);
	     $(this).keydown(function(e) {
         	if (e.which == 37 || e.which == 39) {
	            return false;
         	} 
         });
	 }).blur(function(){
		 $(this).keydown(function(e) {
         	if (e.which == 37 || e.which == 39) {
	            return true;
         	} 
         });
	 });
	 
	 $('a.cerrarAyuda').click(function(){
		 $('div#ayudaUsuario').hide();
	 })
	 
	 $('a.cerrarAyudaAvatar').click(function(){
		 $('div#ayudaAvatar').hide();
	 })
	 
	 $('#campoUsuario a.preg').click(function(e){
		 var posX = e.pageX;
		 var posY = e.pageY;
		 $('div#ayudaAvatar').hide();
		 if ($('div#ayudaUsuario').css('display')=='block'){
			$('div#ayudaUsuario').hide();
		 }else{
			$('div#ayudaUsuario').css('left',posX+20);
			$('div#ayudaUsuario').css('top',posY-50);
			$('div#ayudaUsuario').show();
		 }
	 });	 
	 
	 $('#campoPassword a.preg.ayuda2').click(function(e){
		 var posX = e.pageX;
		 var posY = e.pageY;
		 $('div#ayudaUsuario').hide();
		 if ($('div#ayudaAvatar').css('display')=='block'){
			$('div#ayudaAvatar').hide();
			
		 }else{
			$('div#ayudaAvatar').css('left',posX+20);
			$('div#ayudaAvatar').css('top',posY-50);
			$('div#ayudaAvatar').show();
		 }
	 });	 
});

var accesoBloqueadoController = {
	mostrarModal: function() {
		$("#accesoBloqueadoModal").show();
	 	$("#accesoBloqueadoModal").css("position", "absolute");
	 	$("#accesoBloqueadoModal").css("width", "430px");
		$("#accesoBloqueadoModal").css("font-size", "13px");
		$("#accesoBloqueadoModal").css("text-align", "left");
		$("#accesoBloqueadoModal").css("margin-top", "35px");
		$("#accesoBloqueadoModal").css("margin-left", "-200px");
	 	$('#cerrarABModal').show();
	 	$('#cerrarABModal').unbind('click').click(function() {
	 		$("#accesoBloqueadoModal").hide();
	 		document.getElementById('radioRecordarClave').checked = true;
	 	});
	},
	continuar: function() {
		if($('#radioRecordarClave').is(':checked')) {
			restauracionUsuario(urlRedireccionDesbloqueo);
		} else if ($('#radioNoRecordarClave').is(':checked')) {
			restauracionUsuario(urlRedireccionBlanqueo);
		} else if ($('#radioNoRecordarUsuario').is(':checked')) {
			$("#accesoBloqueadoModal").hide();
			$("#redireccionATMModal").show();
		 	$("#redireccionATMModal").css("width", "400px");
			$("#redireccionATMModal").css("font-size", "13px");
			$("#redireccionATMModal").css("text-align", "justify");
			$("#redireccionATMModal").css("margin-top", "35px");
			$("#redireccionATMModal").css("margin-left", "-200px");
			$('#cerrarRedireccionATMModal').show();
			$('#cerrarRedireccionATMModal').unbind('click').click(function() {
		 		$("#redireccionATMModal").hide();
		 		document.getElementById('radioRecordarClave').checked = true;
		 	});
		} else {
			estado.show("Favor de seleccionar una de las opciones.", estado.tipo.ERROR);
		}
	},
	
	atras: function() {
		$("#accesoBloqueadoModal").hide();
		document.getElementById('radioRecordarClave').checked = true;
	},
	
	aceptarRedireccionATMModal: function() {
		$("#redireccionATMModal").hide();
		document.getElementById('radioRecordarClave').checked = true;
	}
};

var primerIngresoController = {
		mostrarModal: function() {
			$("#primerIngresoModal").show();
		 	$("#primerIngresoModal").css("position", "absolute");
		 	$("#primerIngresoModal").css("width", "500px");
			$("#primerIngresoModal").css("font-size", "13px");
			$("#primerIngresoModal").css("text-align", "left");
			$("#primerIngresoModal").css("margin-left", "-250px");
			$("#primerIngresoModal").css("margin-top", "30px");
		 	$('#cerrarPIModal').show();
		 	$('#cerrarPIModal').unbind('click').click(function() {
		 		$("#primerIngresoModal").hide();
		 		document.getElementById('radioNuevoUsuario').checked = true;
		 	});
	},
	continuar: function() {
		if($('#radioNuevoUsuario').is(':checked')) {
			$("#primerIngresoModal").hide();
		} else {
			if(urlEnrolamiento != null)
				enrolamiento(urlEnrolamiento);
			else
				enrolamientoExterno();
		}
	},
	atras: function() {
		$("#primerIngresoModal").hide();
		document.getElementById('radioNuevoUsuario').checked = true;
	},
};