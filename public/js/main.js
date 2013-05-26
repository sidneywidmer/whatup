/*global require*/
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	urlArgs: "bust=" +  (new Date()).getTime(),
	shim: {
		underscore: {
			exports: '_'
		},
		backbonerelational : {
			deps: [
				'backbone'
			]
		},
		collectionbinder: {
			deps: ['backbone']
		},
		backbone: {
			deps: [
				'underscore',
				'jquery',
			],
			exports: 'Backbone'
		}
	},
	paths: {
		jquery: 'vendor/jquery-1.9.1',
		underscore: 'vendor/underscore',
		backbone: 'vendor/backbone',
		backbonerelational: 'vendor/backbone-relational',
		text: 'vendor/text',
		swfobject: 'vendor/web-socket-js/swfobject',
		websocket: 'vendor/web-socket-js/web_socket',
		modelbinder:  'vendor/backbone-modelbinder',
		collectionbinder: 'vendor/backbone-collectionbinder',
		socketSync: 'socketSync',
		autobahn: 'vendor/autobahn'
	}
});

require([
	'backbone',
	'routers/router',
	'autobahn'
], function (Backbone, Router) {
	console.log(ab);
	/*jshint nonew:false*/
	// Initialize routing and start Backbone.history()
	window.router = new Router();
	Backbone.history.start();

	// Initialize the application view
	//new AppView();
});
