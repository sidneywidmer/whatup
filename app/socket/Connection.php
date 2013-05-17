<?php
use \Sidney\Latchet\BaseConnection;

class Connection extends BaseConnection {

	public function open($connection)
	{
		$connection->WhatUp = new StdClass;
		$connection->WhatUp->name = "anonymous_" . $connection->WAMP->sessionId;

		echo "new connection established \n";
	}

	public function close($connection)
	{

	}

	public function error($connection, $exception)
	{
		//close the connection
		$connection->close();
		echo $exception->getMessage();
		throw new Exception($exception);
	}

}