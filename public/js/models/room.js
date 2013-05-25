/*global define*/
define([
	'underscore',
	'backbone',
	'models/user',
	'collections/users',
	'backbonerelational'
], function (_, Backbone, UserModel, UsersCollection) {
	'use strict';

	var RoomModel = Backbone.RelationalModel.extend({
		relations: [{
			type: Backbone.HasMany,
			key: 'activeusers',
			relatedModel: UserModel,
			reverseRelation: {
				key: 'currentRoom',
				includeInJSON: 'name'
				// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
			}
		}],
		subscribe: function(){
			var channel = 'room/' + this.get('name');
			window.connection.subscribe(channel, function(channel, msg) {
				switch (msg.action)
				{
					case 'newUser':
						console.log('add User');
					break;
					case 'userLeft':
						console.log('remove User');
					break;
					case 'newMessage':
						console.log('new Message');
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
