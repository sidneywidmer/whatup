<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>whatup.</title>
		<link rel="stylesheet" href="css/bootstrap.css">
		<link rel="stylesheet" href="css/font-awesome.min.css">
		<link rel="stylesheet" href="css/style.css">
		<link href='http://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>
	</head>
	<body>

		 <script src="http://autobahn.s3.amazonaws.com/js/autobahn.min.js"></script>
		 <script type="text/javascript">
		 	window.connection = new ab.Session(
				'ws://lampstack.dev:1111', // The host (our Ratchet WebSocket server) to connect to
				function() {
					// Once the connection has been established
					console.log('Connected');
				},
				function() {
					// When the connection is closed
					window.router.notFound();
				},
				{
					// Additional parameters, we're ignoring the WAMP sub-protocol for older browsers
					'skipSubprotocolCheck': true
				}
			);
		 </script>
		<script data-main="js/main" src="js/vendor/require.js"></script>
	</body>
</html>
