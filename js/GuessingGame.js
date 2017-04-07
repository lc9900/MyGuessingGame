function generateWinningNumber(){
    return Math.trunc(Math.random() * 100) + 1;
}

//Use the fisher-yates Shuffle algorithm
//https://bost.ocks.org/mike/shuffle/
function shuffle(arr){
    var m = arr.length,
        randomIndex, temp;
    while(m){
        // Math.random() returns from 0 to 1, not including 1
        // The largest m is 52. so random * m would always be less than 52.
        // Since we use trunc on that product, then the largest randomIndex is 51.
        // 51 is correct, since this is supposed to be index value, so for a 52 element array,
        // index is 0 - 51
        randomIndex = Math.trunc(Math.random() * m);
        // So take the first iteration of this loop.
        // m is 52 on the first iteration.
        // We pick a random index between 0 - 51. 
        // Then lower m to 51.
        m--;
        // swapping value of arr[51] with the arr[randomIndex]
        // so the checked value -- arr[randomIndex] -- gets moved in the back of arr.
        // Unchecked value -- arr[51] -- gets moved into arr[randomIndex]'s spot
        temp = arr[randomIndex];
        arr[randomIndex] = arr[m];
        arr[m] = temp;
    }
    return arr;
}

function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    this.guessCount = 0;
}

Game.prototype.difference = function(){
    return Math.abs(this.winningNumber - this.playersGuess);
};

Game.prototype.isLower = function(){
    return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function(number){
    if(number < 1 || number > 100 || typeof number !== 'number' || number !== number) throw "That is an invalid guess.";
    this.playersGuess = number;
    return this.checkGuess();
};

Game.prototype.checkGuess = function(){
    this.guessCount++;
    if(this.pastGuesses.indexOf(this.playersGuess) !== -1) return "You have already guessed that number."

    this.pastGuesses.push(this.playersGuess);
    if(this.guessCount >= 5 && this.playersGuess !== this.winningNumber ) return "You Lose."
    if(this.playersGuess === this.winningNumber) return "You Win!";
    if(this.difference() < 10) return 'You\'re burning up!';
    if(this.difference() < 25) return 'You\'re lukewarm.';
    if(this.difference() < 50) return 'You\'re a bit chilly.';
    if(this.difference() < 100) return 'You\'re ice cold!';

};

Game.prototype.provideHint = function(){
    var res = [];
    res.push(this.winningNumber);
    res.push(generateWinningNumber());
    res.push(generateWinningNumber());
    return shuffle(res);
};

function newGame(){
    return new Game();
}

function runGame(game){
    var guess = $('#player-input').val();
    $('#player-input').val('');
    console.log("You guessed: " + guess);
    var res = game.playersGuessSubmission(parseInt(guess));
    console.log(res);
    if(res === "You have already guessed that number."){
        // console.log("h1 should change");
        $('#headers>h1').text(res + " Guess again.");
         $('#player-input').val('');
    }
    else if(res === "You Win!" || res === "You Lose."){
        console.log("h1 should change");
        $('#headers>h1').text(res);
        $('#headers>h2').text('Click Reset button to play again.');
        $('#hint, #submit').attr('disabled', true);
        // Even if the pastGuesses length goes past the number of <li> we have,
        // browser wouldn't generate any error.
        $('#guesses>ul>li:nth-child('+ game.pastGuesses.length +')').text(game.playersGuess);
        // if(res === "You Lost.")  $('#player-input').val('');
        // if(res === "You Win!") $('#guesses>ul>li:nth-child('+ game.pastGuesses.length +')').text(game.playersGuess);
        // $('#submit').attr('disabled', true);
    }
    else {
        $('#guesses>ul>li:nth-child('+ game.pastGuesses.length +')').text(game.playersGuess);
        $('#headers>h1').text(res);
        if(game.isLower()) $('#headers>h2').text('Guess Higher');
        else $('#headers>h2').text('Guess Lower');
        // $('#player-input').val('');
    }

}
/////////////////////////////////////////////////
$(document).ready(function(){
    var game = new Game();
    $('#submit').on('click', function(event){
        runGame(game);
    });
    $('#player-input').on('keypress', function(event){
        var key = event.which;
        if(key == 13) runGame(game);
    });
    $('#reset').on('click', function(event){
        $('#hint').removeAttr('disabled');
        $('#submit').removeAttr('disabled');
        $('#headers>h1').text("Guessing Game!");
        $('#headers>h2').text('Guess a number between 1 - 100!');
        $('#guesses>ul>li').text('_');
        $('#player-input').val('');
        game = new Game();
    });
    $('#hint').on('click', function(event){
        $('#headers>h1').text("The answer is between: " + game.provideHint().toString());
    });

});