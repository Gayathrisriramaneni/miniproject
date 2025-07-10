// Game variables
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');

// Game settings
const gridSize = 20;
const tileCount = 20;
let speed = 7;

// Game state
let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let direction = {x: 0, y: 0};
let lastDirection = {x: 0, y: 0};
let gameRunning = false;
let score = 0;
let highScore = 0;
let gameLoop;

// Initialize game
function init() {
    canvas.width = tileCount * gridSize;
    canvas.height = tileCount * gridSize;
    startBtn.addEventListener('click', startGame);
    document.addEventListener('keydown', changeDirection);
}

// Start game
function startGame() {
    if (gameRunning) return;
    
    // Reset game state
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = {x: 0, y: 0};
    lastDirection = {x: 0, y: 0};
    score = 0;
    scoreDisplay.textContent = score;
    
    gameRunning = true;
    startBtn.textContent = 'Restart Game';
    
    // Start game loop
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(main, 1000 / speed);
}

// Main game loop
function main() {
    if (!gameRunning) return;
    
    update();
    draw();
}

// Update game state
function update() {
    // Move snake
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    lastDirection = {...direction};
    
    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }
    
    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        // Generate new food (not on snake)
        food = generateFood();
        score++;
        scoreDisplay.textContent = score;
        
        // Increase speed every 5 points
        if (score % 5 === 0) {
            speed += 1;
            clearInterval(gameLoop);
            gameLoop = setInterval(main, 1000 / speed);
        }
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#2ecc71';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        ctx.strokeStyle = '#27ae60';
        ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
    
    // Draw food
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// Generate food at random position
function generateFood() {
    let newFood;
    let foodOnSnake;
    
    do {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        
        foodOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (foodOnSnake);
    
    return newFood;
}

// Change direction based on key press
function changeDirection(e) {
    // Prevent reversing direction
    if (
        (e.key === 'ArrowUp' || e.key === 'w') && lastDirection.y !== 1
    ) {
        direction = {x: 0, y: -1};
    } else if (
        (e.key === 'ArrowDown' || e.key === 's') && lastDirection.y !== -1
    ) {
        direction = {x: 0, y: 1};
    } else if (
        (e.key === 'ArrowLeft' || e.key === 'a') && lastDirection.x !== 1
    ) {
        direction = {x: -1, y: 0};
    } else if (
        (e.key === 'ArrowRight' || e.key === 'd') && lastDirection.x !== -1
    ) {
        direction = {x: 1, y: 0};
    }
}

// End game
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
    }
    
    alert(`Game Over! Your score: ${score}`);
}

// Initialize the game
init();
