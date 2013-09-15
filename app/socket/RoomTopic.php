<?php
use \Sidney\Latchet\BaseTopic;

class RoomTopic extends BaseTopic {

	//save all current connections
	protected $rooms = array();

	public function subscribe($connection, $topic, $room_name = null)
	{
		//check if room exists
		if($room = Room::where('name', '=', $room_name)->first())
		{
			//save current room to database
			$user = $room->users()->save($connection->WhatUp->user);

			//save user to $rooms array so we have an easy accessible collection
			//of all currently connected users
			$this->rooms[$room_name][$user->session_id] = $user;

			//save current topic a.k.a room and this instance to the conneciton
			$connection->WhatUp->currentRoom = $topic;
			$connection->WhatUp->handler = $this;

			//broadcast that a new user is joined to other subscribers of this room
			$msg = array(
				'action' => 'newUser',
				'user' => $user->toJson(),
				'msg' => 'User ' . $user->name . ' joined.'
			);

			$this->broadcast($topic, $msg, $exclude = array($user->session_id));

			//list all currently connected subscribers to the new guy
			foreach ($this->rooms[$room_name] as $subscriber)
			{
				if($subscriber->session_id != $user->session_id)
				{
					$msg = array(
						'action' => 'newUser',
						'user' => $subscriber->toJson()
					);
					$this->broadcast($topic, $msg, $exclude = array(), $eligible = array($user->session_id));
				}
			}
		}
		else
		{
			//room does not exist
			$connection->close();
		}
	}

	public function publish($connection, $topic, $message, array $exclude, array $eligible)
	{

	}

	public function call($connection, $id, $topic, array $params)
	{
		switch ($params['action']) {
			case 'update':
				if($params['type'] == 'user')
				{
					$result = $this->updateUser($params['model'], $connection, $id, $topic);
				}
				break;
			case 'create':
				if($params['type'] == 'message')
				{
					$result = $this->newMessage($params['model'], $connection, $id, $topic);
				}
				elseif ($params['type'] == 'room') {
					$result = $this->newRoom($params['model'], $connection, $id, $topic);
				}
				break;
			default:
				//something went wrong
				$connection->close();
				break;
		}
	}

	public function unsubscribe($connection, $topic, $room_name = null)
	{
		//boradcast to all subscribers that the usr left
		$user = $connection->WhatUp->user;

		$msg = array(
				'action' => 'userLeft',
				'user' => $user->toJson(),
				'msg' => 'User ' . $user->name . ' left.'
			);

		$this->broadcast($topic, $msg);

		//remove from collection
		unset($this->rooms[$user->room->name][$user->session_id]);

		//save to database
		$user->room_id = 0;
		$user->save();
	}

	/**
	 * update the current user
	 *
	 * @param array $model
	 * @param object $connection
	 * @param string $id
	 * @param object $topic
	 */
	private function updateUser($model, $connection, $id, $topic)
	{
		$user = $connection->WhatUp->user;
		$user->name = $model['name'];

		if($user->save() AND $user->isUnique($model['name'], $model['currentRoom']))
		{
			//just send back the new model so its in sync with the client version
			$connection->callResult($id, $user->toArray());
		}
		else
		{
			//TODO: this should be more generic... something like ->first()
			$connection->callError($id, $topic, $user->validationErrors->first());
		}
	}

	/**
	 * new message got submitted, save it the db
	 * and broadcast it
	 *
	 * @param array $model
	 * @param object $connection
	 * @param string $id
	 * @param object $topic
	 */
	private function newMessage($model, $connection, $id, $topic)
	{
		$user = $connection->WhatUp->user;

		$newMessage = new Message;
		$newMessage->content = $model['content'];
		$newMessage->room_id = $user->room_id;

		if($user->messages()->save($newMessage))
		{
			//boradcast new message to all other subscribers
			$msg = array(
				'action' => 'newMessage',
				'user' => $user->toJson(),
				'message' => $newMessage->toJson()
			);
			$this->broadcast($topic, $msg, $exclude = array($user->session_id));
			$connection->callResult($id, $newMessage->toArray());
		}
		else
		{
			$connection->callError($id, $topic, $user->validationErrors->first('content'));
		}
	}

	/**
	 * create a new room
	 *
	 * @param array $model
	 * @param object $connection
	 * @param string $id
	 * @param object $topic
	 */
	private function newRoom($model, $connection, $id, $topic)
	{
		$user = $connection->WhatUp->user;

		$newRoom = new Room;
		$newRoom->name = strtolower(Str::random(10));

		if($newRoom->save())
		{
			$connection->callResult($id, $newRoom->toArray());
		}
		else
		{
			$connection->callError($id, $topic, $newRoom->validationErrors->first('name'));
		}
	}

}