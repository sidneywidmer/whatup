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
		backbonerelational : ['backbone'],
		collectionbinder: ['backbone'],
		backbone: {
		 	deps:['underscore','jquery'],
			exports: 'Backbone'
		},
		scrollbar: ['jquery']
	},
	paths: {
		jquery: 'vendor/jquery-1.9.1',
		underscore: 'vendor/underscore',
		backbone: 'vendor/backbone',
		backbonerelational: 'vendor/backbone-relational',
		text: 'vendor/text',
		//TODO: How to use web-socket-js with require.js?
		// swfobject: 'vendor/web-socket-js/swfobject',
		// websocket: 'vendor/web-socket-js/web_socket',
		modelbinder:  'vendor/backbone-modelbinder',
		collectionbinder: 'vendor/backbone-collectionbinder',
		socketSync: 'socketSync',
		autobahn: 'vendor/autobahn',
		scrollbar: 'vendor/jquery.mCustomScrollbar',
		moment: 'vendor/moment.min'
	}
});

require([
	'backbone',
	'routers/router'
], function (Backbone, Router) {
	// Initialize routing
	// The history will be started after a successfull socket connection
	// inside the router itself
	window.router = new Router();
});
