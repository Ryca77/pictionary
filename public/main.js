var socket = io();

var pictionary = function() {
    var canvas, context;
    
    var guessBox;
    var onKeyDown = function(event) {
        if (event.keyCode !=13) {
            return;
        }
        console.log(guessBox.val());
        var guess = guessBox.val();
        socket.emit('guess', guess);
        guessBox.val('');
    };
    
    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);
    
    var showGuess = function(guess) {
        $('#answer').show().html('<div>' + 'Guess: ' + guess + '</div>');
    };
    
    //function to show drawing
    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
        context.fill();
        $('#guess').show();
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
    
    //listener for draw and guess events
    socket.on('draw', draw);
    socket.on('guess', showGuess);
};

$(document).ready(function() {
    pictionary();
});