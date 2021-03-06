/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/message.html',
	'modelbinder',
	'collectionbinder'
], function ($, _, Backbone, messageTemplate) {
	'use strict';

	/**
	 * Handles the user view (how many users are subscribing right now)
	 * and displays the actual chat messages
	 */
	var MessageView = Backbone.View.extend({
		template: _.template(messageTemplate),
		tagName: 'div',
		initialize: function(){
			_.bindAll(this);
			this._userModelBinder = new Backbone.ModelBinder();
			this._messageModelBinder = new Backbone.ModelBinder();
		},
		render: function(){
			this.$el.html(this.template());

			var userBindings = {name: {selector: '[data-name=username]'}, connected: {selector: '[data-name=connected]',  elAttribute: 'class', converter:  this.model.get('user').getCssClassName}};
			this._userModelBinder.bind(this.model.get('user'), this.el, userBindings);

			var messageBindings = {created_at: {selector: '[data-name=created_at]', converter: this.model.formatTimestamp}, content: '[data-name=content]'};
			this._messageModelBinder.bind(this.model, this.el, messageBindings);

			//this._modelBinder.bind(this.model, this.el, Backbone.ModelBinder.createDefaultBindings(this.el, 'data-name'));
			return this;
		},
		close: function(){
			this._userModelBinder.unbind();
			this._messageModelBinder.unbind();
			this.off();
			this.undelegateEvents();
			this.remove();
		}

	});

	return MessageView;
});
