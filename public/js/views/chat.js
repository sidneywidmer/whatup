/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/chat.html',
	'views/message',
	'models/message',
	'modelbinder',
	'collectionbinder',
	'scrollbar'
], function ($, _, Backbone, chatTemplate, MessageView, MessageModel) {
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
			this._messageCollectionBinder.on('elCreated', function(model, el){
				$('#messages').mCustomScrollbar("update");
				$('#messages').mCustomScrollbar("scrollTo","bottom");
			});
			//finally subscribe to our room socket
			this.model.subscribe();
		},
		messageViewCreator: function(model){
			return new MessageView({model: model});
		},
		render: function () {
			this.$el.html(this.template());

			//initialize custom scrollbar
			this.scrollable = this.$('#messages');
			this.scrollable.mCustomScrollbar({
				autoHideScrollbar:true,
				theme:"dark-thin"
			});

			this._userCollectionBinder.bind(this.model.get('activeusers'), this.$('#subscribers'));
			//we have to insert directly in the custom scrollbar container
			this._messageCollectionBinder.bind(this.model.get('messages'), this.$('#messages').find(".mCSB_container"));

			return this;
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
			var message = new MessageModel({
				room: this.model,
				user: this.model.currentUser(),
				content: newMessage
			});
			message.save(
				{},
				{
					type: 'message',
					wait: 'true'
				}
			);
		},
		close: function(){
			this._modelBinder.unbind();
			this._userCollectionBinder.unbind();
			this._messageCollectionBinder.unbind();
			this.off();
			this.undelegateEvents();
			this.scrollbar.mCustomScrollbar("destroy");
			this.remove();
		}

	});

	return ChatView;
});
