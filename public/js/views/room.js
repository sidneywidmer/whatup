/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'models/room',
	'views/login',
	'views/chat',
	'text!templates/room.html',
	'modelbinder',
	'collectionbinder',
], function ($, _, Backbone, RoomModel, LoginView, ChatView, roomTemplate) {
	'use strict';

	var RoomView = Backbone.View.extend({

		el: $('#whatup'),
		template: _.template(roomTemplate),
		events: {
			"click #createRoom" : "createRoom"
		},
		initialize: function () {
			this.listenTo(this.model.currentUser(), 'change:name', this.nameChanged);
			this.render();
		},
		render: function () {
			this.$el.html(this.template({roomName: this.model.get('name')}));
			//if the user already has a username, render directly the chat view
			//otherwise we'll start with the login/setUsername view
			if(this.model.currentUser().get('name') !== null){
				this.renderChat();
			}else
			{
				this.renderLogin()
			}

			return this;
		},
		renderLogin: function(){
			this.subview = new LoginView({model: this.model});
			this.subview.setElement(this.$('#subview')).render();
		},
		renderChat: function(){
			this.subview = new ChatView({model: this.model});
			this.subview.setElement(this.$('#subview')).render();
		},
		nameChanged: function(){
			//since we have a name now, show us the actual chat in its full glory!
			this.renderChat();
		},
		createRoom: function(e){
			e.preventDefault();
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
		close: function(){
			this.subview.close();
			this.off();
			this.undelegateEvents();
		}

	});

	return RoomView;
});
