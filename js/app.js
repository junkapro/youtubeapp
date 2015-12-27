//Inicio de la aplicacion, funcion para escuchar eventos 
//cuando la pagina a sido cargada.
$(document).ready(function(){
	//Evento cuando el App a cargado 
	document.addEventListener('deviceready',onDeviceReady, false);
});

//Metodo para cargar los assets de la aplicacion
function onDeviceReady(){
	//Revisando localStorage para ver si existe un canal
	if (localStorage.channel == null || localStorage.channel ==''){
		//Solicitando Canal
		$('#popupDialog').popup(open);
	}else{
		var channel = localStorage.getItem('channel');
		}
	
	//Creando un canal estatico para traer su feed
	//var channel = 'TechGuyWeb';

	//Llama a la funcion getPlaylist para traer la info del channel
	getPlaylist(channel);

	//Handler para asignar el evento Click en la lista de videos
	$(document).on('click','#vidlist li', function(){
		//Funcion para desplegar el video
		showVideo($(this).attr('videoid'));
	});

	//Handler para guadar el canal
	$('#channelBtnOk').click(function(){
		var channel = $('#channelName').val();
		//setChannel para guardar el canal
		setChannel(channel);
		getPlaylist(channel);
	});

	//Handler para guardar Saveoptions
	$('#saveOptions').click(function(){
		saveOptions();
	});

	//Handler para clear channel 
	$('#clearChannel').click(function(){
		clearChannel();
	});

	//Handler para guadar la info en localStorage de options
	$(document).on('pageinit', '#options', function(e){
		//Trae la info de localStorage
		var channel = localStorage.getItem('channel');
		var maxResults = localStorage.getItem('maxresults');
		//Pega la info en los campos
		$('#channelNameOptions').attr('value', channel);
		$('#maxResultsOptions').attr('value', maxResults);
	});
}

//Funcion getPlaylist Trae un tracker de videos para el canal
function getPlaylist(channel){
    //Asegura el espacio en div vidlist como vacio para colocar el contenido
	$('#vidlist').html('');
	//Peticion get  a la API
	$.get(
			//Llamada a la api
			"https://www.googleapis.com/youtube/v3/channels",
			{
				part: 'contentDetails',
				forUsername: channel,
				key: 'AIzaSyAB92GNg6PQLn-_n0zJijAJ0LY4-vt_Pb0'
			},
			//Funcion callback para traer la informacion del request
			function(data){
				//Loop para acceder a data
				$.each(data.items, function(i, item){
					console.log(item);
					playlistId = item.contentDetails.relatedPlaylists.uploads;
					//Funcion para fetchiar los videos, recibe var, #resultados
					getVideos(playlistId, localStorage.getItem('maxresults'));
				});
			}

		);
}

//Funcion getVideos para traer los videos del fetch
function getVideos(playlistId, maxResults){
	$.get(
		//Llamada a la API
		"https://www.googleapis.com/youtube/v3/playlistItems",
		{
			part: 'snippet',
			maxResults: maxResults,
			playlistId: playlistId,
			key: 'AIzaSyAB92GNg6PQLn-_n0zJijAJ0LY4-vt_Pb0'
		}, function(data){
			var output;
			//Loop para ver la informacion
			$.each(data.items, function(i, item){
				id = item.snippet.resourceId.videoId;
				title = item.snippet.title;
				thumb = item.snippet.thumbnails.default.url;
				//Jquery insertando dentro del html
				$('#vidlist').append('<li videoId="'+id+'"><img src="'+thumb+'"><h3>'+title+'</h3></li>');
				$('#vidlist').listview('refresh');
			});
		}
		);
}

//Funcion showVideo para mostrar los videos al hacer click en la lista de videos
function showVideo(id){
	//Ocultar logo para crear espacio 
	$('#logo').hide();
	//iframe para desplegar el video
	var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
	//Colocandolo en el div showVideo
	$('#showVideo').html(output);
}

//Funcion setChannel
function setChannel(channel){
	localStorage.setItem('channel',channel);
	console.log('El canal a sido modificado: '+channel);
}

//Funcion maxResults
function setMaxResults(maxResults){
	localStorage.setItem('maxresults',maxResults);
	console.log('maxResults modificado: '+maxResults);
}

//Funcion saveOptions
function saveOptions(channel){
	var channel = $('#channelNameOptions').val();
	setChannel(channel);
	var maxResults = $('#maxResultsOptions').val();
	setMaxResults(maxResults);
	//Refrescar la pagina para desplegar la nueva informacion
	$('body').pagecontainer('change', '#main', {options});
	getPlaylist(channel);

}

//Funcion clear channel
function clearChannel(){
	//Borrando canal
	localStorage.removeItem('channel');
	//Refrescar la pagina
	$('body').pagecontainer('change', '#main', {options});
	//Clear list de videos del canal
	$('#vidlist').html('');
	//Mostrar popup Dialog
	$('#popupDialog').popup('open');
}