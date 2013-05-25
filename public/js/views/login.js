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
		events: {
			'click .btn':  'setNewName',
			'keypress input[type=text]': 'setNewNameOnEnter'
		},
		render: function () {
			this.$el.html(this.template());
			return this;
		},
		setNewNameOnEnter: function(e) {
			if (e.keyCode != 13) return;
			this.setNewName(e);
		},
		setNewName: function(e) {
			var newName = $('input[type=text]').val();

			if (!newName.trim()) {
				return;
			}

			//we'll triger the change event after we got a successful save from the server
			var currentUser = this.model.currentUser();
			currentUser.save({name: newName}, {method: 'update'});

		}

	});

	return LoginView;
});
