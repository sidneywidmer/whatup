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
	'ws://lampstack.dev:1111', // The host (our Ratchet WebSocket server) to connect to
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
		var that = this;

		App.socket.call(
			currentRoom,
			{'action':'setName', 'value':name}
		).then(function(result){
			if(result.success){
				// set name in the model
				that.get('content').set('name', result.newName);
				//and subscribe to channel
				that.get('room').wsSubscribe();
			}else{
				//Show error
				App.Debug(result.errors);
			}
		}, App.socketError);


		// Clear input field
		this.set('newName', '');
	}
});

App.RoomController = Ember.ObjectController.extend({
	needs: 'CurrentUser',
	currentUser: Ember.computed.alias('controllers.CurrentUser'),
	newSubmitMessage: "whatup i got a big cock",
	init: function(){
		//check if current user has a username
		if(this.get('currentUser').get('name') !== null)
		{
			//if yes, subscribe directly to our websocket channel
			this.wsSubscribe();
		}
	},
	setCurrentUserName: function(){
		//'bubble' event to currentUser
		//TODO: why does this not work directly from the Ember.TextField?
		this.get('currentUser').setName();
	},
	submitMessage: function () {
		// Get the new username from the textfield
		var message = this.get('newSubmitMessage');
		if (!message.trim()) {
			return;
		}

		//save name to socket connection
		var currentRoom = this.get('content').get('fullName');
		var that = this;

		App.socket.call(
			currentRoom,
			{'action':'submitMessage', 'value':message}
		).then(function(result){
			if(result.success){
				// push new message
				var resultMessage = JSON.parse(result.message.message);

				var newMessage = App.Message.create({
					id: resultMessage.id,
					user: that.get('currentUser').get('content'),
					content: resultMessage.content,
					timestamp: resultMessage.created_at
				});

				that.get('content').get('messages').pushObject(newMessage);
			}else{
				//Show error
				App.Debug(result.errors);
			}
		}, App.socketError);


		// Clear input field
		this.set('newSubmitMessage', '');
	},
	wsSubscribe: function(){
		var channel = this.get('content').get('fullName');

		App.Debug('Subscribing to channel ' + channel);
		var that = this;
		App.socket.subscribe(channel, function(channel, msg) {
			App.Debug(msg);
		 	if(msg.action == "newUser"){
				App.Debug('add User');
				that.newUser(JSON.parse(msg.user));
		 	}else if(msg.action == "userLeft"){
		 		App.Debug('remove User');
		 		that.removeUser(JSON.parse(msg.user));
		 	}else if(msg.action == 'newMessage'){
		 		App.Debug('new Message');
		 		that.newMessage(JSON.parse(msg.user), JSON.parse(msg.message))
		 	}
		});
	},
	wsUnsubscribe: function(){},
	newMessage: function(user, message){
		var foundUser = this.get('content').get('users').findProperty('session_id', user.session_id);
		var newMessage = App.Message.create({
			id: message.id,
			user: foundUser,
			content: message.content,
			timestamp: message.created_at
		});

		this.get('content').get('messages').pushObject(newMessage);
	},
	newUser: function(user){
		this.get('content').get('users').pushObject(App.User.create(user));
	},
	removeUser: function(user){
		var foundUser = this.get('content').get('users').findProperty('session_id', user.session_id);
		this.get('content').get('users').removeObject(foundUser);
	}
});

//Models
App.Room = Ember.Object.extend({
	id: null,
	fullName: function() {
		return 'room/' + this.get('id');
	}.property('fullName'),
	messages: null,
	users: null,
	init: function() {
		this._super();
		this.set('users', Ember.A());
		this.set('messages', Ember.A());
	}
});

App.User = Ember.Object.extend({
	session_id: null, //session id of the socket connection
	name: null
});

App.Message = Ember.Object.extend({
	id: null,
	user: null,
	content: null,
	timestamp: null
});