var socket = io();

var pictionary = function() {
    var canvas, context;
    
    //function to show drawing
    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
        context.fill();
    };
    
    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    
    //trigger drawing only with mousedown
    var drawing = null;
    canvas.on('mousedown', function() {
        drawing = true;
    });
    canvas.on('mouseup', function(){
        drawing = false;
    });
    
    //make drawing with mouse and show to all connected sockets
    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        if (drawing === true) {
            draw(position);
            socket.emit('draw', position);
        }
    });
    
    //listener for draw event
    socket.on('draw', draw);
};

$(document).ready(function() {
    pictionary();
});