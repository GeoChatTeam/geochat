//Author: Amanda Afonso
var LocationClient = function(){
	this.markers = {};
	this.marker = null;
	var that = this;
	//create the google map
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(pos){
			var lat = pos.coords.latitude;
			var long = pos.coords.longitude;
			socket.emit('init', {latitude: lat, longitude: long});
			var position = new google.maps.LatLng(lat, long);
			
			var mapOptions = {
				center: position,
				zoom: 15
			};
			
			//save the google map to self
			that.map = new google.maps.Map(document.getElementById("mapholder"), mapOptions);
			
			that.marker = new google.maps.Marker({
				position: position,
				map: this.map,
				title: 'You'
			});
		}, handleError);
		
		//set up watchPosition for updates
		navigator.geolocation.watchPosition(function(pos){
			var lat = pos.coords.latitude;
			var long = pos.coords.longitude;
			var position = new google.maps.LatLng(lat, long);

			socket.emit('update_location', {latitude: lat, longitude: long});

			that.marker.setPosition(position);
			//this might not actually update the map. might need to do:
			//this.marker.setMap(null);
			//this.marker.setMap(this.map);
		}, handleError);
	} else {
		console.log("Geolocation is not supported by this browser.");		
	}
}

//a convenience function to add a marker to our map
LocationClient.prototype.addMarker = function(nickname, latitude, longitude){
	var position = new google.maps.LatLng(latitude, longitude);
	this.markers[nickname] = new google.maps.Marker({
		position: position,
		map: this.map,
		title: nickname
	});
}

//remove a marker from our app
LocationClient.prototype.removeMarker = function(nickname){
	this.markers[nickname].setMap(null);
	delete this.markers[nickname];
}

//relocate a marker. a convenience instead of deleting and creating
LocationClient.prototype.moveMarker = function(nickname, latitude, longitude){
	this.removeMarker(nickname);
	this.addMarker(nickname, latitude, longitude);
}

//called when a user changes their nickname
LocationClient.prototype.updateMarkerTitle = function(prev_nickname, new_nickname){
	this.markers[prev_nickname].setTitle(new_nickname);
	this.markers[new_nickname] = this.markers[prev_nickname];
	delete this.markers[prev_nickname];
	//might need to redraw with setMap(null);
}

function handleError(error)
{
	switch(error.code)
	{
		case error.PERMISSION_DENIED:
			console.log("User denied the request for Geolocation.");
			break;
		case error.POSITION_UNAVAILABLE:
			console.log("Location information is unavailable.");
			break;
		case error.TIMEOUT:
			console.log("The request to get user location timed out.");
			break;
		case error.UNKNOWN_ERROR:
			console.log("An unknown error occurred.");
			break;
	}
}

//gets called when the "update location" button is clicked
LocationClient.prototype.manual_update_listener = function(e){
	var that = this;
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(pos){
			var lat = pos.coords.latitude;
			var long = pos.coords.longitude;
			var position = new google.maps.LatLng(lat, long);

			socket.emit('update_location', {latitude: lat, longitude: long});

			that.marker.setPosition(position);
			//this might not actually update the map. might need to do:
			//this.marker.setMap(null);
			//this.marker.setMap(this.map);
		}, handleError);
	} else {
		console.log("Geolocation is not supported by this browser.");
	}
	
	e.preventDefault();
}

