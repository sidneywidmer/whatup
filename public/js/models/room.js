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
