/*global define*/
define([
	'underscore',
	'backbone',
	'models/user',
	'models/message',
	'backbonerelational'
], function (_, Backbone, UserModel, MessageModel) {
	'use strict';

	var RoomModel = Backbone.RelationalModel.extend({
		relations: [
			{
				type: Backbone.HasMany,
				key: 'activeusers',
				relatedModel: UserModel,
				reverseRelation: {
					key: 'currentRoom',
					includeInJSON: 'name'
				}
			},
			{
				type: Backbone.HasMany,
				key: 'messages',
				relatedModel: MessageModel,
				reverseRelation: {
					key: 'room',
					includeInJSON: 'name'
				}
			}
		],
		subscribe: function(){
			var channel = 'room/' + this.get('name');
			//TODO: Is there a better way? Like binding that to the scobe of subscirbe...
			var that = this;
			window.connection.subscribe(channel, function(channel, msg) {
				switch (msg.action)
				{
					case 'newUser':
						var newUser = JSON.parse(msg.user);
						var user = new UserModel({
							session_id: newUser.session_id,
							currentRoom: that,
							currentUser: false,
							connected: newUser.connected,
							name: newUser.name,
						});
					break;
					case 'userLeft':
						var userLeft = JSON.parse(msg.user);
						var foundUser = that.get('activeusers').findWhere({'session_id': userLeft.session_id});
						foundUser.set('connected', false);
						that.get('activeusers').remove(foundUser);
					break;
					case 'newMessage':
						//TODO: findOrCreate
						var user = JSON.parse(msg.user);
						var message = JSON.parse(msg.message);
						var foundUser = that.get('activeusers').findWhere({'session_id': user.session_id});
						var newMessage = new MessageModel({
							id: message.id,
							created_at: message.created_at,
							room: that,
							user: foundUser,
							content: message.content,
						});
					break;
				}
			});
		},
		defaults: {
			name: ''
		},
		currentUser: function()
		{
			return this.get('activeusers').findWhere({currentUser: true});
		},
		allExceptMe: function()
		{
			return this.get('activeusers').where({currentUser: false});
		}
	});

	return RoomModel;
});
