/*global define*/
define([
	'backbone',
	'socketSync',
	'backbonerelational',
	'moment'
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
		sync: socketSync,
		formatTimestamp: function(direction, value, attribute, model){
			return moment().calendar(model.get(value));
		}
	});

	return MessageModel;
});
