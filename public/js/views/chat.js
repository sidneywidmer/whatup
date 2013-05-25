/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/chat.html',
	'modelbinder',
	'collectionbinder'
], function ($, _, Backbone, chatTemplate) {
	'use strict';

	var ChatView = Backbone.View.extend({
		parentView: null,
		template: _.template(chatTemplate),
		initialize: function() {
			//initialize modelBinder
			this._modelBinder = new Backbone.ModelBinder;
			this.bindingOptions = { boundAttribute: 'data-name' }

			// Normally this will be in a separate html template file
			var liHtml = '<li><span data-name="name"></span></li>';
			var userManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(liHtml, 'data-name');
			this._userCollectionBinder = new Backbone.CollectionBinder(userManagerFactory);
		},
		render: function () {
			this.$el.html(this.template());

			this._modelBinder.bind(this.model, this.el, null, this.bindingOptions);
			this._userCollectionBinder.bind(this.model.get('activeusers'), this.$('#subscribers'));

			return this;
		}

	});

	return ChatView;
});
