<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>whatup.</title>
		<link rel="stylesheet" href="css/bootstrap.min.css">
		<link rel="stylesheet" href="css/style.css">
	</head>
	<body>

		<!-- Default template which gets loaded when we hit / -->
		<script type="text/x-handlebars" data-template-name="application">
			<h2>Welcome to whatup</h2>
			{{outlet}}
		</script>


		<script type="text/x-handlebars" data-template-name="room">
			<p>Room: {{id}}</p>
			<p>CurrentUser: {{currentUser.sessionid}} {{currentUser.name}}</p>
			<p>Other Users:</p>
			<ul>
				{{#each users}}
					<li>{{name}}</li>
				{{/each}}
			</ul>
			{{#if currentUser.name}}
				{{partial 'displayMessages'}}
				{{partial 'submitMessage'}}
			{{else}}
				{{partial 'setUsername'}}
			{{/if}}
		</script>

		<script type="text/x-handlebars" data-template-name="_setUsername">
			<p>Choose username before participating:</p>
			{{view Ember.TextField id="set-username" placeholder="Dr. Emmett Brown" valueBinding="currentUser.newName" action="setCurrentUserName"}}
			<button {{action "setName" target="currentUser"}}>Join</button>
		</script>

		<script type="text/x-handlebars" data-template-name="_displayMessages">
			{{#each messages}}
				<li>{{user.name}} : {{content}}</li>
			{{/each}}
		</script>

		<script type="text/x-handlebars" data-template-name="_submitMessage">
			{{view Ember.TextField id="new-message" placeholder="Type here..." valueBinding="newSubmitMessage" action="submitMessage"}}
			<button {{action "submitMessage"}}>Senden</button>
		</script>

		<script src="js/libs/jquery-1.9.1.js"></script>
		<script src="js/libs/handlebars-1.0.0-rc.3.js"></script>
		<script src="js/libs/ember-1.0.0-rc.3.js"></script>
		<script src="js/libs/web-socket-js/swfobject.js"></script>
		<script src="js/libs/web-socket-js/web_socket.js"></script>
		<script src="http://autobahn.s3.amazonaws.com/js/autobahn.min.js"></script>
		<script src="js/app.js"></script>

	</body>
</html>
