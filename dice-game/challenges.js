/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
var scores, roundScore, activePlayer, gamePlaying, prevoiusDice;

init();

// Adding event listener to Roll Dice button
document.querySelector('.btn-roll').addEventListener('click', function () {

    if (gamePlaying) {
        // Adding random dice 1 - 6
        var dice = Math.floor((Math.random() * 6) + 1);
        var dice2 = Math.floor((Math.random() * 6) + 1);

        // Adding random dice to dice in DOM
        var diceDOM = document.querySelector('.dice')
        var diec2DOM = document.querySelector('.dice2');

        diceDOM.style.display = 'block';
        diec2DOM.style.display = 'block';

        diceDOM.src = 'dice-' + dice + '.png';
        diec2DOM.src = 'dice-' + dice2 + '.png';

        console.log(dice, dice2);


        // Adding a statement

        /* if (dice === 6 && dice2 === 6) {

            document.getElementById('score-' + activePlayer).textContent = '0';
            nextPlayer();

        } else if (dice !== 1 && dice2 !== 1) {
            roundScore += (dice + dice2);
            document.getElementById('current-' + activePlayer).textContent = roundScore;
        } else {
            nextPlayer();
        } */

        if (dice !== 1 && dice2 !== 1) {
            roundScore += (dice + dice2);
            document.getElementById('current-' + activePlayer).textContent = roundScore;
        } else {
            nextPlayer();
        }

        //prevoiusDice = dice;
    }

});

// Adding event listener to HOLD button
document.querySelector('.btn-hold').addEventListener('click', function () {

    var inputScore = document.getElementById('scoreInput').value;
    var winningScore;

    if (inputScore) {
        winningScore = inputScore;
    } else {
        winningScore = 100;
    }


    if (gamePlaying) {
        // Adding current score to Global
        scores[activePlayer] += roundScore;

        // Updating the UI
        document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

        // Checking the winner
        if (scores[activePlayer] >= winningScore) {
            document.getElementById('name-' + activePlayer).textContent = 'WINNER :)';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gamePlaying = false;
        } else {
            // Changing player
            nextPlayer();
        }
    }

});


// Adding event listener to new game button
document.querySelector('.btn-new').addEventListener('click', init)


// Adding function for change player
function nextPlayer() {
    // Changing active player
    activePlayer === 1 ? activePlayer = 0 : activePlayer = 1;
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    // Hideing dice
    //document.querySelector('.dice').style.display = 'none';
    //document.querySelector('.dice2').style.display = 'none';


    // Setting current score to 0
    roundScore = 0;
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

}

// Adding function to start game
function init() {
    scores = [0, 0];
    roundScore = 0;
    activePlayer = 0;
    gamePlaying = true;

    // Hideing dice at start
    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.dice2').style.display = 'none';

    // Setting to 0 global score
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';

    // Setting to 0 round score
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    // Setting to default players names
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';

    // Removing the winner class
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');

    // Removing the active class
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');

    document.querySelector('.player-0-panel').classList.add('active');
}


