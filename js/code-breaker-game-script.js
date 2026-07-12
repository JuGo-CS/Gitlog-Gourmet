const numGuessOptions = 5;
const numGuessTypes = 4;

let maxAttempts = 8;
const correctValues = [];
let attemptNum = 1;
let difficulty = "EASY";
let isPaused = false;

document.addEventListener("DOMContentLoaded", function () {
    // Wait for the white sphere collapse animation, show difficulty popup, play intro
    setTimeout(function () {
        const overlay = document.getElementById('difficulty-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
        // Play intro SFX only (BGM starts after difficulty chosen)
        AudioManager.playIntro(2);
    }, 1000);

    // Add hover + click SFX to interactive elements
    setTimeout(function () {
        // Difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => AudioManager.playHover());
            btn.addEventListener('click', () => AudioManager.playButtonPress());
        });
        // Pause button
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('mouseenter', () => AudioManager.playHover());
        }
        // End card buttons
        document.querySelectorAll('.button-link').forEach(btn => {
            btn.addEventListener('mouseenter', () => AudioManager.playHover());
        });
        // Pause modal buttons
        document.querySelectorAll('#pause-modal .pause-btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => AudioManager.playHover());
        });
        // Back to home arrow
        const arrowHome = document.getElementById('arrow_goHome');
        if (arrowHome) {
            arrowHome.addEventListener('mouseenter', () => AudioManager.playHover());
        }
        // Submit and Reset buttons
        const submitBtn = document.getElementById('game2-submit-button');
        if (submitBtn) {
            submitBtn.addEventListener('mouseenter', () => AudioManager.playHover());
            submitBtn.addEventListener('click', () => AudioManager.playButtonPress());
        }
        const resetBtn = document.getElementById('game2-reset-button');
        if (resetBtn) {
            resetBtn.addEventListener('mouseenter', () => AudioManager.playHover());
            resetBtn.addEventListener('click', () => AudioManager.playButtonPress());
        }
    }, 1200);
});

document.getElementById("game2-reset-button").addEventListener("click", resetGuess);
document.getElementById("game2-submit-button").addEventListener("click", evaluateGuess);

// ============================================================
// Called by difficulty popup buttons
// ============================================================
function startGame2(selectedDifficulty) {
    difficulty = selectedDifficulty;

    // Set attempts based on difficulty
    if (difficulty === "EASY") {
        maxAttempts = 6;
    } else if (difficulty === "MEDIUM") {
        maxAttempts = 5;
    } else { // HARD
        maxAttempts = 4;
    }

    // Reset state
    correctValues.length = 0;
    attemptNum = 1;
    isPaused = false;

    // Hide end card if visible
    document.getElementById('game2-end-card').style.display = 'none';
    document.getElementById('blackBackground_forGameHouses').style.zIndex = '-1';

    // Close difficulty popup
    document.getElementById('difficulty-overlay').classList.remove('active');

    // Show pause button
    document.getElementById('pause-btn').classList.add('visible');

    // Start game BGM (only after difficulty is chosen)
    AudioManager.playBGM('game2');

    // Rebuild attempt containers with new maxAttempts
    createAttemptObjects();
    assignOnClickEventToImg();
    generateOrderToGuess();
}

function createAttemptObjects(){
    const attemptContainer = document.getElementById("game2-attempt-container");
    attemptContainer.innerHTML = ""; // Clear previous attempts

    for (let i = 1; i <= maxAttempts; i++){
        const attemptContent = document.createElement("div");
        attemptContent.id = `attempt-${i}`;

            const attemptImageContainer = document.createElement("div");
            attemptImageContainer.classList.add("attempt-image-container");

            const fruitImgContainer = document.createElement("div");
            fruitImgContainer.id = `fruit-attempt-${i}`;

            const mainImgContainer = document.createElement("div");
            mainImgContainer.id = `main-attempt-${i}`;

            const drinkImgContainer = document.createElement("div");
            drinkImgContainer.id = `drink-attempt-${i}`;

            const dessertImgContainer = document.createElement("div");
            dessertImgContainer.id = `dessert-attempt-${i}`;

            attemptImageContainer.appendChild(fruitImgContainer);
            attemptImageContainer.appendChild(mainImgContainer);
            attemptImageContainer.appendChild(drinkImgContainer);
            attemptImageContainer.appendChild(dessertImgContainer);

        attemptContent.appendChild(attemptImageContainer);

            const attemptHint = document.createElement("div");
            attemptHint.id = `attempt-${i}-hint`;
            attemptHint.classList.add("attempt-hints");

        attemptContent.appendChild(attemptHint);
        
        attemptContainer.appendChild(attemptContent);
    }
}

function assignOnClickEventToImg(){
    document.querySelectorAll('#game2-cabinet table img').forEach(choice => {
        choice.addEventListener('click', function () {
            const radio = choice.closest("td").querySelector("input[type='radio']");

            if (radio) {
                radio.checked = true;
            }

            let divGuessContainer;
            const img = document.createElement("img");
            img.src = choice.src;
            img.alt = choice.alt;

            if (choice.classList.contains("fruit")) {
                divGuessContainer = document.getElementById("fruit-guess")
            }
            else if (choice.classList.contains("main")) {
                divGuessContainer = document.getElementById("main-guess")
            }
            else if (choice.classList.contains("drink")) {
                divGuessContainer = document.getElementById("drink-guess")
            }
            else if (choice.classList.contains("dessert")) {
                divGuessContainer = document.getElementById("dessert-guess")
            }
            else {
                console.error("Unknown class for choice:", choice.classList);
                return;
            }

            divGuessContainer.innerHTML = "";
            divGuessContainer.appendChild(img);
        });
    });
}

function generateOrderToGuess(){
    // Build pool [0..numGuessOptions-1], shuffle, take first numGuessTypes.
    // Guarantees no duplicate value across categories -> 1 correct per column.
    const pool = Array.from({ length: numGuessOptions }, (_, i) => i);

    for (let i = pool.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    for (let i = 0; i < numGuessTypes; i++){
        correctValues.push(pool[i].toString());
    }
}

function resetGuess() {
    document.getElementById("fruit-guess").innerHTML = "";
    document.getElementById("main-guess").innerHTML = "";
    document.getElementById("drink-guess").innerHTML = "";
    document.getElementById("dessert-guess").innerHTML = "";
}

function evaluateGuess() {
    if (!isValidSubmit()){
        alert("Please complete your guess.");
        return;
    }

    const playerFruitGuessValue = document.querySelector('input[name="fruit-choice"]:checked').value;
    const playerMainGuessValue = document.querySelector('input[name="main-choice"]:checked').value;
    const playerDrinkGuessValue = document.querySelector('input[name="drink-choice"]:checked').value;
    const playerDessertGuessValue = document.querySelector('input[name="dessert-choice"]:checked').value;

    const playerGuessValues = [playerFruitGuessValue, playerMainGuessValue, playerDrinkGuessValue, playerDessertGuessValue];

    let correctGuess = 0;
    let correctRow = 0;

    const playerWrongGuess = [];
    const correctRowValues = new Set();

    for (let i = 0; i < numGuessTypes; i++){
        if (playerGuessValues[i] == correctValues[i]){
            correctGuess++;
        }
        else {
            playerWrongGuess.push(playerGuessValues[i]);
            correctRowValues.add(correctValues[i]);
        }
    }

    for (let i = 0; i < playerWrongGuess.length; i++){
        if (correctRowValues.has(playerWrongGuess[i])){
            correctRow++;
        }
    }


    // for background ~ open take out box
    // const openTakeOutBox = document.createElement('img'); 
    // openTakeOutBox.src = "assets/cabinet/Takeout box open back.png";
    document.getElementById(`attempt-${attemptNum}`).style.backgroundImage = 'url("assets/images/Takeout box open back.png")';
    document.getElementById(`attempt-${attemptNum}`).style.backgroundSize = 'cover';
    document.getElementById(`attempt-${attemptNum}`).style.backgroundRepeat = 'no-repeat';


    const fruitAttemptImg = document.createElement('img');
    fruitAttemptImg.src = "assets/cabinet/fruit-" + playerFruitGuessValue + ".png";
    document.getElementById(`fruit-attempt-${attemptNum}`).appendChild(fruitAttemptImg);

    const mainAttemptImg = document.createElement('img');
    mainAttemptImg.src = "assets/cabinet/main-" + playerMainGuessValue + ".png";
    document.getElementById(`main-attempt-${attemptNum}`).appendChild(mainAttemptImg);

    const drinkAttemptImg = document.createElement('img');
    drinkAttemptImg.src = "assets/cabinet/drink-" + playerDrinkGuessValue + ".png";
    document.getElementById(`drink-attempt-${attemptNum}`).appendChild(drinkAttemptImg);

    const dessertAttemptImg = document.createElement('img');
    dessertAttemptImg.src = "assets/cabinet/dessert-" + playerDessertGuessValue + ".png";
    document.getElementById(`dessert-attempt-${attemptNum}`).appendChild(dessertAttemptImg);

    const correctGuessStatus = document.createElement('h3');
    correctGuessStatus.innerHTML = correctGuess.toString();
    correctGuessStatus.classList.add("attempt-hint-correct-guess");
    document.getElementById(`attempt-${attemptNum}-hint`).appendChild(correctGuessStatus);

    const correctRowStatus = document.createElement('h3');
    correctRowStatus.innerHTML = correctRow.toString();
    correctRowStatus.classList.add("attempt-hint-correct-row");
    document.getElementById(`attempt-${attemptNum}-hint`).appendChild(correctRowStatus);

    attemptNum++;

    document.getElementById("correct-guess-prompt").innerHTML = `Correct Guess: ${correctGuess}`;
    document.getElementById("correct-row-prompt").innerHTML = `Correct Row: ${correctRow}`;

    if (correctGuess == numGuessTypes ){
        endGame(true);
    }
    else if (attemptNum - 1 == maxAttempts){
        endGame(false);
    }
    else {
        // Wrong guess (but game continues) — play wrong SFX
        AudioManager.playWrong();
    }
}

function isValidSubmit() {
    const form = document.getElementById("guess-form");
    const radioInputs = form.querySelectorAll('input[type="radio"]');
    const radioNames = new Set();


    radioInputs.forEach(radio => radioNames.add(radio.name));

    let guessComplete = true;
    radioNames.forEach(name => {
        const isChecked = form.querySelector(`input[name="${name}"]:checked`);
        if (!isChecked) {
            guessComplete = false;
        }
    });

    return guessComplete;
}

function endGame(win){
    const result = (win ? "YOU WIN" : "YOU LOSE");

    const ids = [
        'fruit-correct',
        'main-correct',
        'drink-correct',
        'dessert-correct'
      ];

    ids.forEach(id => {
        const container = document.getElementById(id);
        const img = container.querySelector('img');
        if (img) {
          img.remove();
        }
     });

    document.getElementById('game2-end-card').style.display = 'flex';
    document.getElementById('game2-result').innerHTML = result;
    document.getElementById('attempts-end-card').innerHTML = attemptNum - 1;
    document.getElementById('difficulty-end-card').innerHTML = difficulty;
    document.getElementById('score-end-card').innerHTML = calculateGame2Score(win, attemptNum - 1);

    const fruitCorrectImg = document.createElement('img');
    fruitCorrectImg.src = "assets/cabinet/fruit-" + correctValues[0] + ".png";
    document.getElementById("fruit-correct").appendChild(fruitCorrectImg);

    const mainCorrectImg = document.createElement('img');
    mainCorrectImg.src = "assets/cabinet/main-" + correctValues[1] + ".png";
    document.getElementById("main-correct").appendChild(mainCorrectImg);

    const drinkCorrectImg = document.createElement('img');
    drinkCorrectImg.src = "assets/cabinet/drink-" + correctValues[2] + ".png";
    document.getElementById("drink-correct").appendChild(drinkCorrectImg);

    const dessertCorrectImg = document.createElement('img');
    dessertCorrectImg.src = "assets/cabinet/dessert-" + correctValues[3] + ".png";
    document.getElementById("dessert-correct").appendChild(dessertCorrectImg);
    
    document.getElementById('blackBackground_forGameHouses').style.zIndex = '10';

    // Hide pause button
    document.getElementById('pause-btn').classList.remove('visible');
    document.getElementById('pause-overlay').classList.remove('active');

    // Stop BGM
    AudioManager.stopBGM();

    // Calculate and submit score (only on win)
    if (win) {
        AudioManager.playFinish(null);
        const finalScore = calculateGame2Score(win, attemptNum - 1);
        const playerName = getPlayerName();
        submitScoreGame2(playerName, finalScore, difficulty).then(result => {
            if (result && result.submitted) {
                // Check rank after submission
                getPlayerRank('leaderboard_game2', playerName).then(rank => {
                    const rankEl = document.getElementById('game2-rank-display');
                    if (rankEl && rank !== null) {
                        if (rank <= 3) {
                            rankEl.innerHTML = `&#127942; Rank #${rank} — Top 3!`;
                            rankEl.style.color = '#FFD700';
                            AudioManager.playFinish(rank);
                        } else if (rank <= 10) {
                            rankEl.innerHTML = `&#127775; Rank #${rank} — Top 10!`;
                            rankEl.style.color = '#FFE0B2';
                            AudioManager.playFinish(rank);
                        } else {
                            rankEl.innerHTML = `&#128200; Rank #${rank}`;
                            rankEl.style.color = '#FFF';
                        }
                        rankEl.style.display = 'block';
                    }
                });
            }
        });
    } else {
        AudioManager.playLoss();
    }
}

function calculateGame2Score(win, attemptsUsed) {
    if (!win) return 0;
    // More points for fewer attempts, bonus for harder difficulty
    const difficultyMultiplier = difficulty === "EASY" ? 1 : difficulty === "MEDIUM" ? 2 : 3;
    const baseScore = 1000;
    const attemptBonus = Math.max(0, (maxAttempts - attemptsUsed) * 150);
    return (baseScore + attemptBonus) * difficultyMultiplier;
}

function playAgain() {
    // Show difficulty popup again to let player choose
    document.getElementById('pause-btn').classList.remove('visible');
    document.getElementById('difficulty-overlay').classList.add('active');
}

// ============================================================
// PAUSE / RESUME / RESTART
// ============================================================
function togglePause() {
    const overlay = document.getElementById('pause-overlay');
    if (!overlay) return;

    AudioManager.playButtonPress();

    if (overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        isPaused = false;
        AudioManager.resumeBGM();
    } else {
        overlay.classList.add('active');
        isPaused = true;
        AudioManager.pauseBGM();
    }
}

function pauseRestart() {
    document.getElementById('pause-overlay').classList.remove('active');
    isPaused = false;
    AudioManager.playButtonPress();
    playAgain();
}