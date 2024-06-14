document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('startGameForm')) {
        document.getElementById('startGameForm').addEventListener('submit', startGame);
    }

    if (document.getElementById('submitGuess')) {
        document.getElementById('submitGuess').addEventListener('click', submitGuess);
        const player1Name = localStorage.getItem('player1Name');
        const player2Name = localStorage.getItem('player2Name');
        document.getElementById('playerGreeting').textContent = `${player1Name} vs ${player2Name}`;
        document.getElementById('player1NameTally').textContent = player1Name;
        document.getElementById('player2NameTally').textContent = player2Name;
        updateTurnIndicator(player1Name, player2Name);
        generateRandomNumber();
    }

    if (document.getElementById('winnerBanner')) {
        const winnerName = localStorage.getItem('winnerName');
        const winnerGuesses = localStorage.getItem('winnerGuesses');
        document.getElementById('winnerName').textContent = `Congratulations, ${winnerName}! You guessed the number in ${winnerGuesses} guesses.`;
    }
});

let currentPlayer = 1;
let lowerBound = 1;
let upperBound = 100;
let player1GuessCount = 0;
let player2GuessCount = 0;

function startGame(event) {
    event.preventDefault();
    const player1Name = document.getElementById('player1Name').value;
    const player2Name = document.getElementById('player2Name').value;
    localStorage.setItem('player1Name', player1Name);
    localStorage.setItem('player2Name', player2Name);
    window.location.href = 'game.html';
}

function generateRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    localStorage.setItem('randomNumber', randomNumber);
}

function updateTurnIndicator(player1Name, player2Name) {
    const turnIndicator = document.getElementById('turnIndicator');
    if (currentPlayer === 1) {
        turnIndicator.innerHTML = `<span class="highlight">${player1Name}'s turn</span>`;
        document.getElementById('player1NameTally').classList.add('highlight');
        document.getElementById('player2NameTally').classList.remove('highlight');
    } else {
        turnIndicator.innerHTML = `<span class="highlight">${player2Name}'s turn</span>`;
        document.getElementById('player2NameTally').classList.add('highlight');
        document.getElementById('player1NameTally').classList.remove('highlight');
    }
}

function submitGuess() {
    const guess = parseInt(document.getElementById('guessInput').value);
    const randomNumber = parseInt(localStorage.getItem('randomNumber'));
    const player1Name = localStorage.getItem('player1Name');
    const player2Name = localStorage.getItem('player2Name');

    if (guess < lowerBound || guess > upperBound) {
        document.getElementById('feedback').textContent = `Please guess a number between ${lowerBound} and ${upperBound}.`;
        return;
    }

    if (guess === randomNumber) {
        const winnerName = currentPlayer === 1 ? player1Name : player2Name;
        const winnerGuesses = currentPlayer === 1 ? player1GuessCount : player2GuessCount;
        localStorage.setItem('winnerName', winnerName);
        localStorage.setItem('winnerGuesses', winnerGuesses);
        window.location.href = 'victory.html';
    } else {
        if (guess < randomNumber && guess > lowerBound) {
            lowerBound = guess + 1;
        } else if (guess > randomNumber && guess < upperBound) {
            upperBound = guess - 1;
        }
        document.getElementById('lowerBound').textContent = lowerBound;
        document.getElementById('upperBound').textContent = upperBound;
        document.getElementById('feedback').textContent = guess < randomNumber ? 'Too low!' : 'Too high!';
        
        // Update the tally board
        const listItem = document.createElement('li');
        listItem.textContent = guess;
        if (currentPlayer === 1) {
            player1GuessCount++;
            document.getElementById('player1Guesses').appendChild(listItem);
            document.getElementById('player1GuessCount').textContent = player1GuessCount;
        } else {
            player2GuessCount++;
            document.getElementById('player2Guesses').appendChild(listItem);
            document.getElementById('player2GuessCount').textContent = player2GuessCount;
        }

        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateTurnIndicator(player1Name, player2Name);
    }

    document.getElementById('guessInput').min = lowerBound;
    document.getElementById('guessInput').max = upperBound;
}
