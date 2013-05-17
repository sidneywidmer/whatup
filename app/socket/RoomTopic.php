<?php
use \Sidney\Latchet\BaseTopic;

class RoomTopic extends BaseTopic {

	public function subscribe($connection, $topic, $roomid = null)
	{
		echo "new subscription to room " . $roomid . " from user: " . $connection->WhatUp->name . "\n";
	}

	public function publish($connection, $topic, $message, array $exclude, array $eligible)
	{

	}

	public function call($connection, $id, $topic, array $params)
	{
		echo "new call for the following action: " . $params['action'] . " | value: " . $params['newName'] . "\n";

		switch ($params['action']) {
			case 'setName':
				$result = $this->setName($params['newName'], $connection);
				break;
			default:
				# code...
				break;
		}

		$connection->callResult($id, array('success' => $result));
	}

	public function unsubscribe($connection, $topic)
	{

	}

	/**
	 * set new Username
	 *
	 * @param string $name
	 */
	private function setName($name, $connection)
	{
		$connection->WhatUp->name = $name;
		return true;
	}

}