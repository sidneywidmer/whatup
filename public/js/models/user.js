/*global define*/
define([
	'backbone',
	'socketSync',
	'backbonerelational'
], function (Backbone, socketSync) {
	'use strict';

	var UserModel = Backbone.RelationalModel.extend({
		defaults: {
			id : null,
			name: null,
			currentRoom: null,
			currentUser: false, //either ture or false
			connected: false
		},
		sync: socketSync
	});

	return UserModel;
});
