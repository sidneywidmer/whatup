<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function()
{
	// $app = app();
	// dd($app['request']->getHost());
	return View::make('hello');
});

Latchet::connection('Connection');
Latchet::topic('room/{room_name}', 'RoomTopic');