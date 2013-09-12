/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/chat.html',
	'views/message',
	'models/message',
	'models/user',
	'modelbinder',
	'collectionbinder',
	'scrollbar'
], function ($, _, Backbone, chatTemplate, MessageView, MessageModel, UserModel) {
	'use strict';

	/**
	 * Handles the user view (how many users are subscribing right now)
	 * and displays the actual chat messages
	 */
	var ChatView = Backbone.View.extend({
		//TODO: remove?
		parentView: null,
		template: _.template(chatTemplate),
		scrollable: null,
		events: {
			'click #newMessageBtn':  'newMessage',
			'keypress input#newMessage': 'newMessageOnEnter'
		},
		initialize: function() {
			var that = this;
			// Bind the subscbried users
			var liHtml = '<li><span data-name="name"></span></li>';
			var userManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(liHtml, 'data-name');
			this._userCollectionBinder = new Backbone.CollectionBinder(userManagerFactory);

			// Bind the messages
			var messageManagerFactory = new Backbone.CollectionBinder.ViewManagerFactory(this.messageViewCreator);
			this._messageCollectionBinder = new Backbone.CollectionBinder(messageManagerFactory);

			//finally subscribe to our room socket
			this.subscribe();
		},
		messageViewCreator: function(model){
			return new MessageView({model: model});
		},
		render: function () {
			this.$el.html(this.template());

			this._messageCollectionBinder.on('elCreated', function(model, el){
				$('#messages').mCustomScrollbar("update");
				$('#messages').mCustomScrollbar("scrollTo","bottom");
			});
			var height = $(window).height() - 374;
			if(height > 200){
				$('.messages').height(height);
			}else{
				$('.messages').height(200);
			}

			//initialize custom scrollbar
			this.scrollable = this.$('#messages');
			this.scrollable.mCustomScrollbar({
				autoHideScrollbar:true,
				theme:"dark-thin"
			});

			this._userCollectionBinder.bind(this.model.get('users'), this.$('#subscribers'));
			//we have to insert directly in the custom scrollbar container
			this._messageCollectionBinder.bind(this.model.get('messages'), this.$('#messages').find(".mCSB_container"));

			return this;
		},
		afterRender: function(){
		},
		subscribe: function(){
			var channel = 'room/' + this.model.get('name');
			//TODO: Is there a better way? Like binding that to the scope of subscirbe...
			//TODO: split switch statement in different functions
			var that = this;
			window.connection.subscribe(channel, function(channel, msg) {
				switch (msg.action)
				{
					case 'newUser':
						var newUser = JSON.parse(msg.user);
						var foundUser = that.model.get('users').findWhere({'session_id': newUser.session_id});
						if(foundUser){
							foundUser.set('connected', true);
						}else{
							var user = UserModel.findOrCreate({
								session_id: newUser.session_id,
								currentRoom: that.model,
								currentUser: false,
								connected: newUser.connected,
								name: newUser.name,
							});
						}
					break;
					case 'userLeft':
						var userLeft = JSON.parse(msg.user);
						var foundUser = that.model.get('users').findWhere({'session_id': userLeft.session_id});
						foundUser.set('connected', false);
						that.model.get('users').remove(foundUser);
					break;
					case 'newMessage':
						//TODO: findOrCreate
						var user = JSON.parse(msg.user);
						var message = JSON.parse(msg.message);
						var foundUser = that.model.get('users').findWhere({'session_id': user.session_id});
						var newMessage = new MessageModel({
							id: message.id,
							created_at: message.created_at,
							room: that.model,
							user: foundUser,
							content: message.content,
						});
					break;
				}
			});
		},
		unsubscribe: function(){
			var channel = 'room/' + this.model.get('name');
			window.connection.unsubscribe(channel);
		},
		newMessageOnEnter: function(e) {
			if (e.keyCode != 13) return;
			this.newMessage(e);
		},
		newMessage: function(e) {
			var newMessage = $('input[type=text]').val();

			if (!newMessage.trim()) {
				return;
			}

			// //we'll triger the change event after we got a successful save from the server
			var currentUser = this.model.currentUser();
			var m = this.model.get('messages').create({
					//room: this.model,
					user: this.model.currentUser(),
					content: newMessage
				},{
					type: 'message',
					wait: 'true'
			});
			$('input[type=text]').val('');
		},
		close: function(){
			this.unsubscribe();
			this._userCollectionBinder.unbind();
			this._messageCollectionBinder.unbind();
			this.off();
			this.undelegateEvents();
			this.scrollable.mCustomScrollbar("destroy");
			this.remove();
		}

	});

	return ChatView;
});
