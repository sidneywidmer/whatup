/*global define*/
define([
	'backbone',
	'socketSync',
	'backbonerelational'
], function (Backbone, socketSync) {
	'use strict';

	var MessageModel = Backbone.RelationalModel.extend({
		defaults: {
			id : null,
			user: null,
			room: null,
			content: null,
			created_at: null,
		},
		sync: socketSync
	});

	return MessageModel;
});
