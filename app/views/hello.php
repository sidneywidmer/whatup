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

		<!-- Default template which gets loaded when we hit / -->
		<script type="text/x-handlebars" data-template-name="application">
				{{outlet}}
		</script>


		<script type="text/x-handlebars" data-template-name="room">
			<div class="intro">
				<div class="intro-text">
					<h1 class="color clouds">whatup <i class="icon-chevron-right color alizarin"></i> <span class="color midnight-blue">{{id}}</span></h1>
				</div>
			</div>
			<div class="clearfix"></div>
			<div class="container">
				{{#if currentUser.name}}
					{{partial 'chat'}}
				{{else}}
					{{partial 'setUsername'}}
				{{/if}}
			</div>
		</script>

		<script type="text/x-handlebars" data-template-name="_setUsername">
			<div class="set-username">
				<p>Mind telling us your name before participating?</p>
				{{view Ember.TextField id="set-username" placeholder="Dr. Emmett Brown" valueBinding="currentUser.newName" action="setCurrentUserName"}}
				<!--<button {{action "setName" target="currentUser"}} class="btn btn-large">Join</button>-->
			</div>
		</script>

		<script type="text/x-handlebars" data-template-name="_chat">
			<div class="chat">
				<div class="messages">
					<ul>
					{{#each messages}}
						<li>{{user.name}} : {{content}}</li>
					{{/each}}
					</ul>
					<div class="new-message">
						{{view Ember.TextField id="new-message" placeholder="Type here..." valueBinding="newSubmitMessage" action="submitMessage"}}
						<button {{action "submitMessage"}} class="btn btn-large">Senden</button>
					</div>
				</div>
				<div class="users">
					<ul>
						<li class="users-title">Subscribers:</li>
					{{#each users}}
						<li>{{name}}</li>
					{{else}}
						<li>Forever alone :(</li>
					{{/each}}
					</ul>
				</div>
			</div>
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
