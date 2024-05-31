// script.js
document.addEventListener('DOMContentLoaded', () => {
    const statements = {
        bio: [
            { statement: 'The powerhouse of the cell.', term: 'mitochondria' },
            { statement: 'The process by which plants make their food.', term: 'photosynthesis' }
        ],
        chem: [
            { statement: 'The basic unit of a chemical element.', term: 'atom' },
            { statement: 'A substance made up of only one type of atom.', term: 'element' }
        ],
        physics: [
            { statement: 'The force that attracts a body towards the center of the earth.', term: 'gravity' },
            { statement: 'The speed of light in vacuum is approximately.', term: '299792458' }
        ],
        all: []
    };
    statements.all = [...statements.bio, ...statements.chem, ...statements.physics];

    let randomizedStatements = [];
    let currentStatementIndex = 0;
    let score = 0;
    let timeLeft = 150; // Default to 2:30 mins (150 seconds)
    let timer;
    let selectedMode = '';
    let selectedTime = 150;

    const introPage = document.getElementById('intro-page');
    const startGameButton = document.getElementById('start-game');
    const modeButtons = document.querySelectorAll('.mode-button');
    const timeButtons = document.querySelectorAll('.time-button');
    const gameContainer = document.getElementById('game-container');
    const statementElement = document.getElementById('statement');
    const wordBoxesElement = document.getElementById('word-boxes');
    const keyboardElement = document.getElementById('keyboard');
    const timerElement = document.getElementById('timer');
    const scoreboardElement = document.getElementById('scoreboard');
    const skipButton = document.getElementById('skip-button');
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.getElementById('message');
    const playAgainButton = document.getElementById('play-again');
    const exitButton = document.getElementById('exit');

    modeButtons.forEach(button => {
        button.addEventListener('click', () => selectMode(button));
    });

    timeButtons.forEach(button => {
        button.addEventListener('click', () => selectTime(button));
    });

    function selectMode(button) {
        modeButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedMode = button.id.replace('mode-', '');
        checkStartButton();
    }

    function selectTime(button) {
        timeButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedTime = parseInt(button.id.split('-')[1]) * 60;
        checkStartButton();
    }

    function checkStartButton() {
        if (selectedMode && selectedTime) {
            startGameButton.disabled = false;
        }
    }

    startGameButton.addEventListener('click', startGame);

    function startGame() {
        introPage.style.display = 'none';
        gameContainer.style.display = 'block';
        currentStatementIndex = 0;
        score = 0;
        timeLeft = selectedTime;
        randomizedStatements = shuffleArray(statements[selectedMode].slice());
        displayStatement();
        createKeyboard();
        startTimer();
    }

    function displayStatement() {
        const currentStatement = randomizedStatements[currentStatementIndex];
        statementElement.textContent = currentStatement.statement;
        wordBoxesElement.innerHTML = '';
        for (let i = 0; i < currentStatement.term.length; i++) {
            const box = document.createElement('div');
            box.className = 'word-box';
            box.setAttribute('data-index', i);
            wordBoxesElement.appendChild(box);
        }
        resetKeyboard();
    }

    function createKeyboard() {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        keyboardElement.innerHTML = '';
        for (let letter of alphabet) {
            const key = document.createElement('div');
            key.className = 'key';
            key.textContent = letter;
            key.addEventListener('click', () => handleLetterClick(letter));
            keyboardElement.appendChild(key);
        }
    }

    function resetKeyboard() {
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.classList.remove('used');
            key.addEventListener('click', () => handleLetterClick(key.textContent));
        });
    }

    function handleLetterClick(letter) {
        const currentStatement = randomizedStatements[currentStatementIndex];
        const term = currentStatement.term;
        const letterBoxes = document.querySelectorAll('.word-box');

        let correctGuess = false;
        for (let i = 0; i < term.length; i++) {
            if (term[i] === letter) {
                letterBoxes[i].textContent = letter;
                correctGuess = true;
                score += 10;
            }
        }

        if (!correctGuess) {
            score -= 5;
        }

        const key = Array.from(keyboardElement.children).find(k => k.textContent === letter);
        key.classList.add('used');
        key.removeEventListener('click', () => handleLetterClick(letter));

        updateScore();
        checkCompletion();
    }

    function updateScore() {
        scoreboardElement.textContent = Score: ${score};
    }

    function startTimer() {
        timerElement.textContent = Time: ${formatTime(timeLeft)};
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = Time: ${formatTime(timeLeft)};
            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame('Time\'s up! Play Again?');
            }
        }, 1000);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return ${minutes}:${secs < 10 ? '0' : ''}${secs};
    }

    function checkCompletion() {
        const letterBoxes = document.querySelectorAll('.word-box');
        let completed = true;
        letterBoxes.forEach(box => {
            if (box.textContent === '') {
                completed = false;
            }
        });
        if (completed) {
            score += 150;
            updateScore();
            showMessage('Congratulations! You found the term!', false);
        }
    }

    function showMessage(msg, showButtons) {
        messageElement.textContent = msg;
        messageContainer.style.display = 'flex';
        if (!showButtons) {
            setTimeout(() => {
                messageContainer.style.display = 'none';
                currentStatementIndex = (currentStatementIndex + 1) % randomizedStatements.length;
                displayStatement();
            }, 2000);
        }
    }

    function endGame(msg) {
        messageElement.textContent = msg;
        messageContainer.style.display = 'flex';
        playAgainButton.style.display = 'inline-block';
        exitButton.style.display = 'inline-block';
    }

    playAgainButton.addEventListener('click', () => {
        messageContainer.style.display = 'none';
        startGame();
    });

    exitButton.addEventListener('click', () => {
        messageContainer.style.display = 'none';
        gameContainer.style.display = 'none';
        introPage.style.display = 'block';
    });

    skipButton.addEventListener('click', () => {
        currentStatementIndex = (currentStatementIndex + 1) % randomizedStatements.length;
        displayStatement();
    });

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});