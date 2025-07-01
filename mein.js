// Calling canvas
const canvas = document.getElementById('gameCanvas');
const scoreDisplay = document.getElementById('score');

// calling audio sound effect and food img
const eatSound = new Audio('./assets/eat.wav');
const gameOverSound = new Audio('./assets/game over.wav');

/*
const foodImg = new Image();
foodImg.src = './assets/food.png';
*/

const ctx = canvas.getContext('2d');

// Size of snake and food
const grid = 20;
const canvasSize = 900;

// Position of snake and food
let snake = [{
    x: 160,
    y: 160
}];

let food = {
    x: 160,
    y: 160
}; // Changed to an object

// Snake speed
let dx = grid;
let dy = 0;

// Ensure the snake doesn't reverse direction
let changingDirection = false;

// Game score
let scoreCount = 0;
scoreDisplay.innerHTML = `score: ${scoreCount}`;

// Control the game progression 
function gameLoop() {
    if (changingDirection) return;
    changingDirection = true;
    moveSnake();
    if (isCollision()) {
        gameOverSound.play()
        alert(`Game Over! Your score: ${scoreCount}`);
        document.location.reload();
        return;
    }
    // Clear the canvas 
    clearCanvas();
    drawFood();
    drawSnake();

    
    // Adjust the timeout for game speed
    // setTimeout(gameLoop, 100);
    
    // next gear of game speed, the game level will be hard when you hit 10 score 
    if (scoreCount < 10) {
        setTimeout(gameLoop, 100);
    } else{6
        setTimeout(gameLoop, 60);
    }
}

// Move the snake function
function moveSnake() {
    // Position of the snake's head
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };
    // Add new snake head
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        // Increase score
        scoreCount++;
        scoreDisplay.innerHTML = `score: ${scoreCount}`;
        // sound effect
        eatSound.play()
        // Place new food
        placeFood();
    } else {
        // Remove the tail if not eating food
        snake.pop();
    }
    changingDirection = false;
}

// Draw new snake function
function drawSnake() {
    // Snake color
    ctx.fillStyle = 'white';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, grid, grid));
}

// Draw new food function 
function drawFood() {
    // Food color
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, grid, grid);
}

// Clear canvas function
function clearCanvas() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
}

// Detect collision with walls or itself
function isCollision() {
    const head = snake[0];
    // Check if the head hits the walls
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true;
    }
    // Check if the head collides with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

// Direction control with keyboard
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && dy === 0) {
        dx = 0;
        dy = -grid;
    }
    if (e.key === 'ArrowDown' && dy === 0) {
        dx = 0;
        dy = grid;
    }
    if (e.key === 'ArrowLeft' && dx === 0) {
        dx = -grid;
        dy = 0;
    }
    if (e.key === 'ArrowRight' && dx === 0) {
        dx = grid;
        dy = 0;
    }
});

// Place food at a random position
function placeFood() {
    food.x = Math.floor(Math.random() * canvasSize / grid) * grid;
    food.y = Math.floor(Math.random() * canvasSize / grid) * grid;
}

// Start the game loop
document.addEventListener('keypress', () => {
    gameLoop();
})
