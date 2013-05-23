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
					<h1 class="color clouds">whatup <i class="icon-chevron-right color nephritis"></i> <span class="color midnight-blue">{{id}}</span></h1>
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
				<a {{action "setName" target="currentUser"}} class="btn"><i class="icon-ok"></i></a>
			</div>
		</script>

		<script type="text/x-handlebars" data-template-name="_chat">
			<div class="chat row">
				<div class="messages-wrap span9">
					<div class="messages">
						{{#each messages}}
							<div class="message">
								<div class="ball-big">
									{{#if user.connected}}
										<div class="ball bg nephritis"></div>
									{{else}}
										<div class="ball bg clouds"></div>
									{{/if}}
								</div>
								<div class="user-message span2">
									<span class="user-message-username">{{user.name}}: </span>
									<span class="user-message-timestamp">{{datehelper timestamp}}</span>
								</div>
								<div class="content-message span6">
								 	{{content}}
								</div>
							</div>
						{{/each}}
					</div>
					<div class="new-message row">
						{{view Ember.TextField id="new-message" placeholder="Type here..." valueBinding="newSubmitMessage" action="submitMessage"}}
						<a {{action "submitMessage"}} class="btn"><i class="icon-ok"></i></a>
					</div>
				</div>
				<div class="users span3">
					<ul>
						<li class="users-title">Subscribers:</li>
						<li>You ({{currentUser.name}})</li>
						{{#each users}}
							<li>{{name}}</li>
						{{/each}}
					</ul>
				</div>
			</div>
		</script>

		<script src="js/libs/jquery-1.9.1.js"></script>
		<script src="js/libs/handlebars-1.0.0-rc.3.js"></script>
		<script src="js/libs/ember-1.0.0-rc.3.js"></script>
		<script src="js/libs/moment.min.js"></script>
		<script src="js/libs/web-socket-js/swfobject.js"></script>
		<script src="js/libs/web-socket-js/web_socket.js"></script>
		<script src="http://autobahn.s3.amazonaws.com/js/autobahn.min.js"></script>
		<script src="js/app.js"></script>

	</body>
</html>
