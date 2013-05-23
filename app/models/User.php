<?php
use LaravelBook\Ardent\Ardent;

class User extends Ardent {

	/**
	* Ardent validation rules
	*/
	public static $rules = array(
		'session_id' => 'required|alpha_num',
		'name' => 'alpha_dash|max:20|min:2',
		'connected' => 'required|in:0,1'
	);

	/**
	 * define relationship to room
	 */
	 public function room()
	 {
	 	return $this->belongsTo('room');
	 }

	/**
	 * define relationship to messages
	 */
	 public function messages()
	 {
	 	return $this->hasMany('message');
	 }

}