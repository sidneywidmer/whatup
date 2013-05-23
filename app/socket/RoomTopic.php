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

			echo "new subscription. Room: " . $room_name . " | User: " . $user->session_id . "\n";
		}
		else
		{
			//room does not exist
			echo"Room does not exist, dafuq? \n";
			$connection->close();
		}
	}

	public function publish($connection, $topic, $message, array $exclude, array $eligible)
	{

	}

	public function call($connection, $id, $topic, array $params)
	{
		echo "new call for the following action: " . $params['action'] . " | value: " . $params['value'] . "\n";

		switch ($params['action']) {
			case 'setName':
				$result = $this->setName($params['value'], $connection);
				break;
			case 'submitMessage':
				$result = $this->newMessage($params['value'], $connection, $topic);
				break;
			default:
				# code...
				break;
		}

		$connection->callResult($id, $result);
	}

	public function unsubscribe($connection, $topic)
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

		echo "unsubscribed. User: " . $connection->WhatUp->user->name . "\n";
	}

	/**
	 * set new Username
	 *
	 * @param string $name
	 */
	private function setName($newName, $connection)
	{
		$user = $connection->WhatUp->user;
		$user->name = $newName;

		if($user->save())
		{
			return array('success' => true, 'newName' => $user->name);
		}
		else
		{
			return array('success' => false, 'errors' => $user->validationErrors->get('name'));
		}
	}

	/**
	 * new message got submitted, save it the db
	 * and broadcast it
	 *
	 * @param string $message
	 */
	private function newMessage($message, $connection, $topic)
	{
		$user = $connection->WhatUp->user;

		$newMessage = new Message;
		$newMessage->content = $message;
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

			return array('success' => true, 'message' => $msg);
		}
		else
		{
			return array('success' => false, 'errors' => $newMessage->validationErrors->get('content'));
		}
	}

}