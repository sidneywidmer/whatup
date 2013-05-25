/*global define*/
define([
	'jquery',
	'backbone',
	'models/room',
	'models/user',
	'views/room'
], function ($, Backbone, RoomModel, UserModel, RoomView) {
	'use strict';

	var Router = Backbone.Router.extend({
		routes: {
			'': 'joinRoom',
			':roomName': 'joinRoom'
		},
		joinRoom: function(roomName){
			if(typeof(roomName) == 'undefined') roomName = 'lobby';
			var room = new RoomModel({name: roomName});
			//room.fetch()
			if(true){
				//Insert some dummy data
				var user = new UserModel( { session_id: 'woei9384lsSDKd1', currentRoom: room, currentUser: true } );
				var user = new UserModel( { session_id: 'woei9384lsSDKd2', name: 'Yannick', currentRoom: room } );
				var user = new UserModel( { session_id: 'woei9384lsSDKd3', name: 'Esthi', currentRoom: room } );

				this.view = new RoomView({model: room}).render();
				//console.log(room.currentUser().get('name'));
			}else{
				this.notFound();
			}
		},
		notFound: function(){
			console.log('room not found');
		}
	});

	return Router;
});
