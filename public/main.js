var socket = io();

var pictionary = function() {
    var canvas, context;
    var start = $('#start');
    var playerType = $('#playertype');
    
    socket.emit('start', start);
    
    //function to show start button to first connected socket
    var showButton = function(start) {
        $('#start').show();
        if ($('#start').is(':visible')) {
            playerType.html('You are the drawer');
        }
    };
    
    var words = [
        "word", "letter", "number", "person", "pen", "class", "people",
        "sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
        "girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
        "land", "home", "hand", "house", "picture", "animal", "mother", "father",
        "brother", "sister", "world", "head", "page", "country", "question",
        "answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
        "farm", "story", "sea", "night", "day", "life", "north", "south", "east",
        "west", "child", "children", "example", "paper", "music", "river", "car",
        "foot", "feet", "book", "science", "room", "friend", "idea", "fish",
        "mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
        "body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
        "rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
        "space"
    ];
       
    var word = words[Math.floor(Math.random()*words.length)];
    
    //show word to first connected socket on button click
    start.on('click', function() {
        console.log(word);
        showWord(word);
        socket.emit('word', word);
        start.hide();
    });
    
    //function to show word and player type to first connected socket
    var showWord = function(word) {
        $('#word').show().html('Your word: ' + word);
    };
    
    //enter guess and show to all connected sockets 
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
    
    //function to show guess
    var showGuess = function(guess) {
        $('#answer').show().html('Guess: ' + guess);
        if (guess === word) {
            console.log('correcto');
        }
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
    
    //make drawing and show to all connected sockets
    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        var position = {x: event.pageX - offset.left,
                        y: event.pageY - offset.top};
        if (playerType.html() === 'You are the drawer') {
            if (drawing === true) {
                draw(position);
                socket.emit('draw', position);
            }
        } else {
            playerType.html('You are a guesser');
        }
        
    });
    
    //listener for show word, draw and guess events
    socket.on('start', showButton);
    socket.on('word', showWord);
    socket.on('draw', draw);
    socket.on('guess', showGuess);

};

$(document).ready(function() {
    pictionary();
});