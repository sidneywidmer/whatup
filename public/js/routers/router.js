/*global define*/
define([
	'jquery',
	'backbone',
	'models/room',
	'models/user',
	'models/message',
	'views/room',
	'autobahn'
], function ($, Backbone, RoomModel, UserModel, MessageModel, RoomView) {
	'use strict';

	var Router = Backbone.Router.extend({
		routes: {
			'': 'joinRoom',
			'create' : 'createRoom',
			':roomName': 'joinRoom'
		},
		/**
		 * initialize the socket connection
		 */
		initialize: function()
		{
			window.connection = new ab.Session(
				'ws://lampstack.dev:1111', // The host (our Ratchet WebSocket server) to connect to
				function() {
					// Once the connection has been established
					console.log('Connected');
					Backbone.history.start();
				},
				function() {
					// When the connection is closed
					window.router.notFound();
				},
				{
					// Additional parameters, we're ignoring the WAMP sub-protocol for older browsers
					'skipSubprotocolCheck': true
				}
			);
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
		createRoom: function(){
			console.log("woot")
		},
		notFound: function(){
			console.log('room not found');
		}
	});

	return Router;
});
