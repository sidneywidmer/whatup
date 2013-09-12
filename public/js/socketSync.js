/*global define*/
define([
	'jquery',
	'backbone'
], function ($, Backbone) {
	'use strict';

	var socketSync = function(method, model, options){
		if(method == "update" || method == 'create'){
			window.connection.call(
				'room/' + window.router.activeRoom.get('name'),
				{'action': method, type: options.type, 'model':model}
			).then(
				function(success){
					if(options.success) options.success(success);
				},
				function(error){
					if(options.error) options.error(error);
				}
			);
		}else{
			Backbone.sync(method, model, options);
		}
	};

	return socketSync;
});
