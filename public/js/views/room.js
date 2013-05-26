/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'views/login',
	'views/chat',
	'text!templates/room.html',
	'modelbinder',
	'collectionbinder'
], function ($, _, Backbone, LoginView, ChatView, roomTemplate) {
	'use strict';

	var RoomView = Backbone.View.extend({

		el: 'body',
		template: _.template(roomTemplate),
		initialize: function () {
			this.listenTo(this.model.currentUser(), 'change', this.nameChanged);
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
		renderLogin: function()
		{
			this.subview = new LoginView({model: this.model});
			this.subview.setElement(this.$('#subview')).render();
		},
		renderChat: function()
		{
			this.subview = new ChatView({model: this.model});
			this.subview.setElement(this.$('#subview')).render();
		},
		nameChanged: function()
		{
			//since we have a name now, show us the actual chat in its full glory!
			this.renderChat();
		}

	});

	return RoomView;
});
