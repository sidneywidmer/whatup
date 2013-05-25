/*global define*/
define([
	'jquery',
	'backbone'
], function ($, Backbone) {
	'use strict';

	var socketSync = function(method, model, options){
		if(method == "update"){
			window.connection.call(
				'room/lobby',
				{'action':'updateUser', 'model':model}
			).then(function(result){
				if(result.success){
					//model.trigger('change');
					console.log(result);
				}else{
					//Show error
					console.log(result.errors);
				}
			}, null);
		}else{
			Backbone.sync(method, model, options);
		}
	};

	return socketSync;
});
