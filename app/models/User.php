<?php
use LaravelBook\Ardent\Ardent;

class User extends Ardent {

	/**
	* Ardent validation rules
	*/
	public static $rules = array(
		'session_id' => 'required|alpha_num',
		'name' => 'alpha_dash|max:20|min:2',
		'connected' => 'required|in:0,1',
	);

	/**
	 * only expose these values to the frontend
	 */
	protected $visible = array('session_id', 'name', 'connected');

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

	 /**
	  * make shure the username is valid for this room
	  *
	  * @param $newName string
	  * @param $roomName string
	  * @return bool
	  */
	 public function isUnique($newName, $roomName)
	 {
	 	$room = Room::where('name', '=', $roomName)->first();
	 	$count = User::where('room_id', '=', $room->id)->where('connected', '=', 1)->where('name', '=', $newName)->count();
	 	$this->validationErrors->add('name', 'This name has already been taken :(');
	 	return $count === 0 ? true : false;
	 }

}