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
		_modelBinder: undefined,
		initialize: function(){
			_.bindAll(this);
			this._userModelBinder = new Backbone.ModelBinder();
			this._messageModelBinder = new Backbone.ModelBinder();
		},
		render: function(){
			this.$el.html(this.template());

			var userBindings = {name: {selector: '[data-name=username]'}, connected: {selector: '#connectedStatus',  converter:  this.model.get('user').getCssClassName}}; //elAttribute: 'class',
			this._userModelBinder.bind(this.model.get('user'), this.el, userBindings);

			var messageBindings = {created_at: '[data-name=created_at]', content: '[data-name=content]'};
			this._messageModelBinder.bind(this.model, this.el, messageBindings);

			//this._modelBinder.bind(this.model, this.el, Backbone.ModelBinder.createDefaultBindings(this.el, 'data-name'));
			return this;
		},
		close: function(){
			// An example of what your view should probably be doing when it's closed, otherwise you'll end up w/ zombies
			this._modelBinder.unbind();
			this.off();
			this.undelegateEvents();
			this.remove();
		}

	});

	return MessageView;
});
