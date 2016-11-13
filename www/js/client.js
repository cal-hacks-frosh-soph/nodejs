var WIDTH = 1100;
var HEIGHT = 580;
var socket = io.connect(window.location.protocol + "//" + window.location.hostname + ":8082");
var game = new Game('#arena', WIDTH, HEIGHT, socket);
var selectedTank = 1;
var tankName = '';
var imageName = '';

socket.on('addTank', function(tank){
	game.addTank(tank.id, tank.imageName, tank.type, tank.isLocal, tank.x, tank.y, tank.imageData);
});

socket.on('sync', function(gameServerData){
	game.receiveData(gameServerData);
});

socket.on('killTank', function(tankData){
	game.killTank(tankData);
});

socket.on('removeTank', function(tankId){
	game.removeTank(tankId);
});

$(document).ready( function(){

	$('#join').click( function(){
		tankName = $('#tank-name').val();
		imageName = $('#tank-image').val();
		console.log("val: " + imageName);
		joinGame(tankName, imageName, selectedTank, socket);
	});

	$('#tank-name').keyup( function(e){
		tankName = $('#tank-name').val();
		var k = e.keyCode || e.which;
		if(k == 13){
			joinGame(tankName, imageName, selectedTank, socket);
		}
	});

	$('#tank-image').keyup( function(e){
		imageName = $('#tank-image').val();
		var k = e.keyCode || e.which;
		if(k == 13){
			joinGame(tankName, imageName, selectedTank, socket);
		}
	});

	$('ul.tank-selection li').click( function(){
		$('.tank-selection li').removeClass('selected')
		$(this).addClass('selected');
		selectedTank = $(this).data('tank');
	});

});

$(window).on('beforeunload', function(){
	socket.emit('leaveGame', tankName);
});

function joinGame(tankName, imageName, tankType, socket){
	if(tankName != ''){
		$('#prompt').hide();
		console.log("join game: " + imageName)
		socket.emit('joinGame', {id: tankName, imageName: imageName, type: tankType});
	}
}
