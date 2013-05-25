/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/login.html',
	'modelbinder',
	'collectionbinder'
], function ($, _, Backbone, loginTemplate) {
	'use strict';

	var LoginView = Backbone.View.extend({

		template: _.template(loginTemplate),
		render: function () {
			this.$el.html(this.template());
			return this;
		}

	});

	return LoginView;
});
