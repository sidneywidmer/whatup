/*global define*/
define([
	'underscore',
	'backbone',
	'models/user',
	'models/message',
	'socketSync',
	'backbonerelational'
], function (_, Backbone, UserModel, MessageModel, socketSync) {
	'use strict';

	var RoomModel = Backbone.RelationalModel.extend({
		relations: [
			{
				type: Backbone.HasMany,
				key: 'users',
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
		sync: socketSync,
		currentUser: function(){
			return this.get('users').findWhere({currentUser: true});
		},
		connectedUsers: function(){
			return new Backbone.Collection(this.get('users').where({connected: 1}));
		},
		allExceptMe: function(){
			return this.get('users').where({currentUser: false});
		}
	});

	return RoomModel;
});
