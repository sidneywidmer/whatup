/*global define*/
define([
	'backbone',
	'backbonerelational',
	'autobahn'
], function (Backbone, ab) {
	'use strict';

	var UserModel = Backbone.RelationalModel.extend({
		defaults: {
			session_id : null,
			name: null,
			currentRoom: null,
			currentUser: false, //either ture or false
			connected: false
		}
	});

	return UserModel;
});
