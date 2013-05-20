<?php
use LaravelBook\Ardent\Ardent;

class Room extends Ardent {

	/**
	* Ardent validation rules
	*/
	public static $rules = array(
		'name' => 'required|alpha_num',
	);

	/**
	 * define relationship to users
	 */
	 public function users()
	 {
	 	return $this->hasMany('user');
	 }

	 /**
	 * define relationship to messages
	 */
	 public function messages()
	 {
	 	return $this->hasMany('message');
	 }

}