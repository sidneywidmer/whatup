//Flash socket location
WEB_SOCKET_SWF_LOCATION = "/js/libs/web-socket-js/WebSocketMain.swf";

//Global app
App = Ember.Application.create({
	LOG_TRANSITIONS: true,
	LOG_BINDINGS: true,
	socket: null,
	ready: function(){
		App.Debug('App is ready!')
	}
});

App.Debug = function(msg) {
	var debug = true;
	if (debug) {
		console.log(msg);
	}
}

//Connect to our websocket, if everything worked as expected, start the applicaton
App.deferReadiness();
App.socket = new ab.Session(
	'ws://whatup.laravel-devbox.dev:1111', // The host (our Ratchet WebSocket server) to connect to
	function() {
		// Once the connection has been established
		App.Debug('Connected');
		App.advanceReadiness(); //Fire!
	},
	function() {
		// When the connection is closed
		App.Debug('WebSocket connection closed');
	},
	{
		// Additional parameters, we're ignoring the WAMP sub-protocol for older browsers
		'skipSubprotocolCheck': true
	}
);

//register global error handler
App.socketError = function(error){ App.Debug('Error: ' + error); };

//Routes
App.Router.map(function() {
	this.route("room", { path: "/:room_id"});
});

App.ApplicationRoute = Ember.Route.extend({
	setupController: function(){
		//set the current user
		var newUser = App.User.create({id: App.socket._session_id});
		this.controllerFor('CurrentUser').set("content", newUser);
	}
});

App.IndexRoute = Ember.Route.extend({
	defaultRoom: null,
	init: function(){
		//If we hit the index route, create lobby (default room)
		//and redirect to it
		this.defaultRoom = App.Room.create({id: 'lobby'});
	},
	redirect: function() {
		this.transitionTo('room', this.defaultRoom);
	}
});

App.RoomRoute = Ember.Route.extend({
	model: function(params){
		return App.Room.create({id: params.room_id});
	},
	setupController: function(controller, model) {
		controller.set('content', model);
		//also subscribe directly to our websocket channel
		controller.wsSubscribe();
	}
});

//Controllers
App.CurrentUserController = Ember.ObjectController.extend({
	needs: 'room',
	room: Ember.computed.alias('controllers.room'),
	setName: function () {
		// Get the new username from the textfield
		var name = this.get('newName');
		if (!name.trim()) {
			return;
		}

		//save name to socket connection
		var currentRoom = this.get('room').get('content').get('fullName');
		App.socket.call(currentRoom, {'action':'setName', 'newName':name}).then(function(result) {App.Debug(result);}, App.socketError);

		// set name in the model
		this.get('content').set('name', name);

		// Clear input field
		this.set('newName', '');
	}
});

App.RoomController = Ember.ObjectController.extend({
	needs: 'CurrentUser',
	currentUser: Ember.computed.alias('controllers.CurrentUser'),
	testFunction: function(){
		console.log(this.get('content').get('id'));
	},
	setCurrentUserName: function(){
		//'bubble' event to currentUser
		//TODO: why does this not work directly from the Ember.TextField?
		this.get('currentUser').setName();
	},
	wsSubscribe: function(){
		var channel = this.get('content').get('fullName');

		App.Debug('Subscribing to channel ' + channel);

		App.socket.subscribe(channel, function(channel, msg) {
		 	App.Debug(msg);
		});
	},
	wsUnsubscribe: function(){},
	submitMessage: function(){},
	newMessage: function(){},
	newUser: function(){}
});

//Models
App.Room = Ember.Object.extend({
	id: null,
	fullName: function() {
		return 'room/' + this.get('id');
	}.property('fullName'),
	users: null,
	messages: null
});

App.User = Ember.Object.extend({
	id: null, //session id of the socket connection
	name: null
});

App.Message = Ember.Object.extend({
	id: null,
	content: null,
	timestamp: null
});