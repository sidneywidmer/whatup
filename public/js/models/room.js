/*global define*/
define([
	'underscore',
	'backbone',
	'models/user',
	'collections/users',
	'autobahn',
	'backbonerelational'
], function (_, Backbone, UserModel, UsersCollection, ab) {
	'use strict';

	var RoomModel = Backbone.RelationalModel.extend({
		relations: [{
			type: Backbone.HasMany,
			key: 'activeusers',
			relatedModel: UserModel,
			reverseRelation: {
				key: 'currentRoom',
				includeInJSON: 'id'
				// 'relatedModel' is automatically set to 'Zoo'; the 'relationType' to 'HasOne'.
			}
		}],
		initialize: function(){

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
