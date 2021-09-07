/**
 * 
 * 
 * Uso:
 * 
 * var options = {
 *  	formId:"formId",
 *  	pollUrl:"poll.htm",
 *  	loadCompleteFunction:function(json){...},
 *  	validationsConfig:{json de configuración de validaciones},
 *      customValidationFunction: function(){...},
 *  	maxPollCount:3,
 *  	maxPermPollHandler:function(message){...},
 *  	errorHandler:function(message){...},
 *  	pollTimeout:3000
 * }
 * 
 * var trxController = new LinkTransactionController(options);
 * 
 * Al instanciarlo maneja el submit del formulario de id formId
 * 
 * Detalle de opciones:
 * - formId: Identificador del form a submitear. Obligatorio
 * - pollUrl: Url para el poll. Opcional: puede especificarse como variable global 
 *            o puede no especificarse si no se trata de invocaciones asincrónicas
 * - loadCompleteFunction: Callback a invocar cuando vuelva la respuesta. Obligatorio
 * - validationsConfig: Configuración jquery.validate. Opcional
 * - customValidationFunction: Función de validación adicional. Seguir signatura de 
 *   validaciones de plugin jquery.form: function validate3(formData, jqForm, options).
 *   (http://malsup.com/jquery/form/#code-samples) Opcional
 * 
 *  TODO Terminar de documentar
 * 
 * Nota: Por ahora manejamos solo forms.
 * 
 * @param options
 * @return
 */
function LinkTransactionController(options) {

	// -------------------------------------------------------------------------------
	// Opciones
	//
	//var url = options.url; TODO (para especificar una url en vez de un form
	var formId = options.formId;
	var pollUrl = options.pollUrl?options.pollUrl:globalPollUrl;
	//var tagIds = options.tagIds; TODO
	var loadCompleteFunction = options.loadCompleteFunction ? options.loadCompleteFunction : null;
	// var idEspera = options.idEspera; TODO
	var validationsConfig= options.validationsConfig;	
	var customValidationFunction = options.customValidationFunction;
	var maxPollCount=options.maxPollCount?options.maxPollCount:globalMaxPollCount;
	var handleMaxPermPoll=options.maxPermPollHandler?options.maxPermPollHandler:defaultHandleMaxPermPoll;
	var handleError=options.errorHandler?options.errorHandler:defaultErrorHandler;
	var pollTimeout=options.pollTimeout?options.pollTimeout:globalPollTimeout;
	var handleValidationErrors=options.validationErrorHandler?options.validationErrorHandler:defaultValidationErrorHandler;
	var errorListener=options.errorListener?options.errorListener:null;
	var validationErrorListener=options.validationErrorListener?options.validationErrorListener:null;
	var ajaxSubmit=options.ajaxSubmit;

	var redefinedPollContext = null;
	var redefinePollContext = options.redefinePollContext?options.redefinePollContext:false;
	if(redefinePollContext){
		redefinedPollContext = options.redefinedPollContext?options.redefinedPollContext:null;
		if(redefinedPollContext == null || redefinedPollContext == ""){
			redefinePollContext = false;
		}
	}	
	
	//
	// -------------------------------------------------------------------------------
	var pollCount=0;
	
	this.transactionId= transactionController.currentTransactionId;
	
	//console.log(" LINKTRANSACTIONCONTROLLER - ID: " + this.transactionId);

	// Registra el manejador de las respuesta del server
	validationsConfig['submitHandler'] = function(form) 
	{		
		var ajaxSubmitOptions;		
			
		if(customValidationFunction && customValidationFunction != null) {
			ajaxSubmitOptions = { success: genericCallbackFunction, 
								  beforeSubmit: customValidationFunction, 
								  error: doHandleAjaxError};
		} else {
			ajaxSubmitOptions = { success: genericCallbackFunction, 
								  error: doHandleAjaxError};
		}

		if (ajaxSubmit != false) {
	        // inside event callbacks 'this' is the DOM element so we first 
	        // wrap it in a jQuery object and then invoke ajaxSubmit 
	        $(form).ajaxSubmit(ajaxSubmitOptions);
	        // !!! Important !!! 
	        // always return false to prevent standard browser submit and page navigation 
	        return false; 
		} else {
			form.submit();
			return true;
		}
	 
	};
	
	// Registrar validaciones	
	$("#" + formId  ).validate(validationsConfig);	
														
	function genericCallbackFunction(result, statusText) 
	{
		var json = getJSON(result);
		
		if (json == null) {
		    handleSessionExpired();
		} else if(json.response.expirationMessage) {
		    handleSessionExpired();
		} else if (json.response.correlationId) { 
	    	// si esta pendiente
	    	handlePending(json.response.correlationId, pollCount);
	    } else if (json.response.message == "sessionExpired") { 
	    	// session expirada
	    	handleSessionExpired();
	    } else if (json.response.message == "intentosExcedidos") {
	    	// intentos excedidos
	    	handleIntentosExcedidos();	    	
	    } else if (json.response.messages) {
			doHandleValidationErrors(json.response.messages);
	    } else if (json.response.message) { 
	    	// si se produjo un error en el servidor
	    	// TODO Revisar si aquí entran los errores de validación del servidor
	    	doHandleError(json.response);
	    } else {
	    	// si esta todo ok
	    	if (loadCompleteFunction != null || loadCompleteFunction != undefined) {
	    		loadCompleteFunction(json);
	    	}
		}
	};
	
	// Todos los resultados de tipo json comienzan con una llave.
	function getJSON(result) {
		if (result.charAt(0) == "{") {
			// LINKI-4023
			if($.browser.msie && $.browser.version >= "7.0") {
				var pattern = /\r/g;
				result = result.replace(pattern, '\\r'); 
			}			
			return eval("(" + result + ")");
		} else {
			return null;
		}
	}

	function handlePending(correlationId, currentPollCount)
	{
	     if (pollCount <= maxPollCount) {
			 pollCount =  pollCount + 1;
			 waitAndPoll(correlationId, pollCount );		    	 
	     } else { 
	    	 // si se llego al maximo de polls permitidos
	    	 pollCount=0;
	    	 handleMaxPermPoll();
	     }
	}
	
	function waitAndPoll(correlationId, pollCount )
	{
 		setTimeout(
 					function timerCallback() {
 						pollFor(correlationId, pollCount );
 					}, pollTimeout
 				   );
	};
	
	function  pollFor(correlationId, pollCount )
	{
		if(transactionController.isValid(this.transactionId)) {			
			var urlAux = pollUrl;
			if(redefinePollContext){
				urlAux = redefinedPollContext + pollUrl;
			}
			$.post(urlAux, {correlationId: correlationId}, function(json) {	 	    
				genericCallbackFunction(json, pollCount);
			});
		}
	};	
	
	function defaultHandleMaxPermPoll() {
		if(transactionController.isValid(this.transactionId)) {
			estado.show('Por el momento no se puede realizar la transacci&oacute;n. Por favor, intente nuevamente m&aacute;s tarde.', 'error');
		}
		pollCount=0;
	};
	
	function handleSessionExpired() {
		estado.show('Su sesi&oacute;n ha caducado. Por favor, ingrese nuevamente.', 'error');
		window.location = getLoginPageLTC() + '?sessionExpired=true' + getParametrosAdicionalesLTC(true);
	};
	
	function handleIntentosExcedidos() {
		window.location = getLoginPageLTC();
	};
	
	function doHandleError(response) {
		if(transactionController.isValid(this.transactionId)) {
			handleError(response);	
			if (errorListener != null)
				errorListener(response);
		}
	};	

	function doHandleAjaxError() {
		if(transactionController.isValid(this.transactionId)) {
			var object = new Object();
			object["message"] = "Se ha producido un error de comunicaci&oacute;n. Por favor reintente la operaci&oacute;n.";
			object["code"] = "Error_Submit";			
			doHandleError(object);
		}		
	};	
	
	function defaultErrorHandler(response) {
		if(transactionController.isValid(this.transactionId)) {
			estado.show(response.message, 'error'); 
		}
	};
	
	function doHandleValidationErrors(messages) {
		if(transactionController.isValid(this.transactionId)) {
			handleValidationErrors(messages);	
			if (validationErrorListener != null)
				validationErrorListener(messages);
		}
	};
	
	function defaultValidationErrorHandler(messages) {
		if(transactionController.isValid(this.transactionId)) {
			var msg = "";
			for(var i = 0;i<messages.length;i++) {
				var tupla = messages[i];
				msg = msg + tupla.field + ": " + tupla.message + "<br/>";
			}
			estado.show(msg, 'error');
		}
	};	
}

// Muestra el contenido de un objeto javascript (solo Firefox)
// @author pdistefano 
function log(myObj) {
	if (myObj == null) alert("null");
	else alert(myObj.toSource());
}

//TODO REFACTORIZAR

//Esto se repite en los archivos:
//LinkTransactionController.js
//LinkLoader.js
//link-controller.js
//modificando solo el nombre de la funcion y del array asociativo.

//Se repite porque por el momento no puedo asumir el costo de buscar/generar un lugar comun
//Se cambian los nombres porque no se como pueden responder los diferentes interpretes de js al encontrar dos
//entidades con el mismo nombre (por mas que funcionalmente sean identicas) y dado que hay lugares donde se incluyen
//mas de uno de estos archivos
var productoToLoginPageLTC = new Array(2);
productoToLoginPageLTC["hb"] = "login.htm";
productoToLoginPageLTC["gp"] = "loginGP.htm";

function getLoginPageLTC(){
	var match = /https?:\/\/([^\.]*)/.exec(window.location);
	if(match != null && match.length == 2){
		if( productoToLoginPageLTC[match[1]] != undefined && productoToLoginPageLTC[match[1]] != null ){
			return productoToLoginPageLTC[match[1]];
		}
		else{
			return "login.htm";
		}
	}
	else{
		return "login.htm";
	}
}

function getParametrosAdicionalesLTC(yaTieneParametro){
	
	var ret = "";
	var match = /https?:\/\/([^\.]*)/.exec(window.location);
	if(match != null && match.length == 2){
		
		if(match[1] == "gp"){
			
			if( typeof(idSolicitudPago) != "undefined" && idSolicitudPago != null && idSolicitudPago != ""){
				
				if(yaTieneParametro){
					ret += "&";
				}
				ret += "id=";
				ret += idSolicitudPago;
				
				yaTieneParametro = true; //Por si se agregan otros abajo				
			}

		}
	}

	return ret;
}
