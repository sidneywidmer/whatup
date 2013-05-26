/*global define*/
define([
	'backbone',
	'socketSync',
	'backbonerelational'
], function (Backbone, socketSync) {
	'use strict';

	var UserModel = Backbone.RelationalModel.extend({
		idAttribute: "session_id",
		defaults: {
			session_id : null,
			name: null,
			currentRoom: null,
			currentUser: false, //either ture or false
			connected: false
		},
		sync: socketSync,
		/**
		 * Helper for the converter to display
		 * in the frontend. This decides which class
		 * we should append. It gets called outside of the model context
		 */
		getCssClassName: function(direction, value, attribute, model){
			return model.get('connected') ? 'nephritis' : 'clouds';
		}

	});

	return UserModel;
});
