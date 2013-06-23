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
		sync: socketSync,
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
