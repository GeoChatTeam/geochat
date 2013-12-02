    var LAT = 0;
    var LONG = 0;
    var x = document.getElementById("output");

    function getUserLocation()
    {
        if (navigator.geolocation)
        {
            navigator.geolocation.watchPosition(getCoordinates, handleError, {frequency: 300000});  //updates user location every 5 minutes
        }
        else{x.innerHTML="Geolocation is not supported by this browser.";}
    }
    function getCoordinates(position)
    {
        LAT = position.coords.latitude;
        LONG = position.coords.longitude;

        var latlon=LAT+","+LONG;
        socket.emit('location_update', {latitude: LAT, longitude: LONG});
        x.innerHTML="Current location: Latitude " + LAT + ", Longitude: " + LONG + " *This will be removed once the map is working.*";

        /* CODE FOR PRINTING THE MAP
         not 100% functional yet

         var img_url="http://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false";
         var map = document.getElementById("mapholder");
         var marker = new google.maps.Marker({
         map: map,
         position: new google.maps.LatLng(LAT, LONG),
         title: (label || "You are here!")
         });
         map.innerHTML="<img src='"+img_url+"'>"; >*/
    }
    function handleError(error)
    {
        switch(error.code)
        {
            case error.PERMISSION_DENIED:
                x.innerHTML="User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML="Location information is unavailable."
                break;
            case error.TIMEOUT:
                x.innerHTML="The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML="An unknown error occurred."
                break;
        }
    }
