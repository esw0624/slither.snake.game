const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const startButton = document.querySelector(".start-button");

let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [
// Initialize with one body part with the head
    [snakeX - 1, snakeY], 
    [snakeX - 2, snakeY]   
]; 
let velocityX = 1, velocityY = 0; // The snake moves to the right by default when the game is started
let gameOver = false;
let setIntervalID;
let score = 0;
let directionChanged = false;

// Gets high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    // Random 0 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Clears the timer and reloads the page if the game is over
    clearInterval(setIntervalID);
    alert("Game Over! Press OK to replay");
    location.reload();
}

const changeDirection = (e) => {
    // Velocity value changes depending on what key is pressed
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
    directionChanged = true;
}

const initGame = () => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++; // Increment the score by 1

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        // Shifts one value of elements to the snake body
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; // Sets the first element of the snake body to the current snake position

    // Updates the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // Checks if the snake's head is outside the wall, setting gameOver to true if it does
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adds a div for each part of the snake's body
        if (i === 0) {
            htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        } else {
            htmlMarkup += `<div class="body" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        }

        // Checks if the snake head hits its own body, if it did the gameOver is set to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = htmlMarkup;
}

const startGame = () => {
    startButton.style.display = 'none'; // Hide the start button
    changeFoodPosition();
    setIntervalID = setInterval(initGame, 125);
    document.addEventListener("keydown", changeDirection);
}

startButton.addEventListener("click", startGame);

const resizeGameArea = () => {
    const wrapper = document.querySelector('.wrapper');
    const size = Math.min(window.innerWidth, window.innerHeight, 500); // Set maximum size to 500px

    wrapper.style.width = `${size}px`;
    wrapper.style.height = `${size}px`;
};

window.addEventListener('resize', resizeGameArea);
resizeGameArea();