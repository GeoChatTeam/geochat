var socket = io.connect('http://localhost:3000');

socket.on('connect', function(data){
    console.log('connected');
});

socket.on('error', function(data){
    console.log('unable to connect');
});