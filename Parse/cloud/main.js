Parse.Cloud.define('live', function(request, response) {
	var query = new Parse.Query(Parse.Installation);
	Parse.Push.send({
		where:		query,
		expiration_interval: 3600,
		data: {
			alert: request.params.message,
			title: "Cocktail Napkin Studios",
			sound: "shaker-marker.caf"
		}
	},
	{
		success: function() {
			response.success('Yay! Push!');
		},
		error: function() {
			response.error('No push.');
		}
	});
});

Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});