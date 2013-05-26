/*global define*/
define([
	'jquery',
	'backbone',
	'models/room',
	'models/user',
	'models/message',
	'views/room'
], function ($, Backbone, RoomModel, UserModel, MessageModel, RoomView) {
	'use strict';

	var Router = Backbone.Router.extend({
		routes: {
			'': 'joinRoom',
			':roomName': 'joinRoom'
		},
		initialize: function()
		{

		},
		joinRoom: function(roomName){
			if(typeof(roomName) == 'undefined') roomName = 'lobby';

			//create the desired room (defaults lobby)
			var room = new RoomModel({name: roomName});

			//Add our current User object
			var user = new UserModel( { session_id: window.connection._session_id, currentRoom: room, currentUser: true, connected: true } );

			//load view
			this.view = new RoomView({model: room}).render();
		},
		notFound: function(){
			console.log('room not found');
		}
	});

	return Router;
});
