/*global define*/
define([
	'underscore',
	'backbone',
	'models/user',
	'models/room'
], function (_, Backbone, UserModel) {
	'use strict';

	var UsersCollection = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: UserModel
	});

	return new UsersCollection();
});
