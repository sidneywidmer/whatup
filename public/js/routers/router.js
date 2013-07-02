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
			var that = this;

			//check if loadFlashPlicyFile function exits (if yes, the flashpolifyll is used)
			if(typeof WebSocket.loadFlashPolicyFile === 'function')
			{
				WebSocket.loadFlashPolicyFile("xmlsocket://lampstack.dev:61011");
			}

			window.connection = new ab.Session(
				'ws://lampstack.dev:61010', // The host (our Ratchet WebSocket server) to connect to
				function() {
					// Once the connection has been established
					console.log('Connected');
					Backbone.history.start();
				},
				function() {
					// When the connection is closed
					that.notFound();
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
			if(typeof(this.activeRoom) == 'undefined'){
				this.activeRoom = new RoomModel({name: roomName});

				//Add our current User object
				var user = new UserModel( { session_id: window.connection._session_id, currentRoom: this.activeRoom, currentUser: true, connected: true } );
			}else{
				var currentUser = this.activeRoom.currentUser();

				//close and unsubscribe from current room
				this.roomView.close();

				//switch to new room
				this.activeRoom = new RoomModel({name: roomName});
				currentUser.set('currentRoom', this.activeRoom);
			}

			//load view
			this.roomView = new RoomView({model: this.activeRoom});
		},
		createRoom: function(){
			var newRoom = new RoomModel();
			var r = newRoom.save(
				{},
				{
					type: 'room',
					wait: 'true',
					success: this.roomCreated
				}
			);
		},
		roomCreated: function(room){
			//redirect to the newly created room
			Backbone.history.navigate('#/' + room.get('name'));
		},
		notFound: function(){
			console.log('room not found');
		}
	});

	return Router;
});
