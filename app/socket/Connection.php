<?php
use \Sidney\Latchet\BaseConnection;
use LaravelBook\Ardent\Ardent;

class Connection extends BaseConnection {

	public function open($connection)
	{
		//in case of a mysql timeout, reconnect
		//to the database
		$app = app();
		$app['db']->reconnect();

		$user = new User;
		$user->session_id = $connection->WAMP->sessionId;
		$user->connected = 1;

		//validate model
		if($user->save())
		{
			//we'll cache the user model here so we don't have to
			//get it from the database everytime
			$connection->WhatUp = new StdClass;
			$connection->WhatUp->user = $user;
		}
		else
		{
			$connection->close();
		}

		echo "new connection established. User: " . $user->session_id . " \n";
	}

	public function close($connection)
	{
		//maybe the close gets fired before we could create a new user model
		if(isset($connection->WhatUp))
		{
			$user = $connection->WhatUp->user;
			$user->connected = 0;
			$user->save();

			//unsubscribe from current room, if we have subscribed to one
			if(isset($connection->WhatUp->handler))
			{
				$connection->WhatUp->handler->unsubscribe($connection, $connection->WhatUp->currentRoom);
			}

			echo "connection closed. User: " . $user->session_id . " \n";
		}
		else
		{
			echo "connection closed. User was not even connected \n";
		}

	}

	public function error($connection, $exception)
	{
		//close the connection
		$connection->close();
		echo $exception->getMessage();
		throw new Exception($exception);
	}

}