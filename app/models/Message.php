<?php
use LaravelBook\Ardent\Ardent;

class Message extends Ardent {

	/**
	* Ardent validation rules
	*/
	public static $rules = array(
		'content' => 'required|max:1500|min:1',
	);

	/**
	 * define relationship to room
	 */
	 public function room()
	 {
	 	return $this->belongsTo('room');
	 }

	/**
	 * define relationship to user
	 */
	 public function user()
	 {
	 	return $this->belongsTo('user');
	 }

}