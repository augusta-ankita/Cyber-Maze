let baseMazeSize = 10;
let playerPosition = { x: 0, y: 0 };
let goalPosition = { x: 9, y: 9 };
let mazeGrid = [];
let timer;
let timeLeft = 30;
let level = 1;
let score = 0;
let currentMazeSize = baseMazeSize;

function createMaze() {
  let validMaze = false;
  while (!validMaze) {
    const maze = document.getElementById("maze");
    maze.innerHTML = "";
    mazeGrid = [];
    maze.style.gridTemplateColumns = `repeat(${currentMazeSize}, 30px)`;
    maze.style.gridTemplateRows = `repeat(${currentMazeSize}, 30px)`;

    for (let y = 0; y < currentMazeSize; y++) {
      const row = [];
      for (let x = 0; x < currentMazeSize; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell", "fade-in");

        const isWall = Math.random() < 0.25 && !(x === 0 && y === 0) && !(x === currentMazeSize - 1 && y === currentMazeSize - 1);
        if (isWall) {
          cell.classList.add("wall");
        }

        maze.appendChild(cell);
        row.push(cell);
      }
      mazeGrid.push(row);
    }

    validMaze = isPathAvailable();
    if (!validMaze) maze.innerHTML = "";
  }

  mazeGrid[playerPosition.y][playerPosition.x].classList.add("player");
  mazeGrid[goalPosition.y][goalPosition.x].classList.add("goal");
}

function isPathAvailable() {
  const visited = Array.from({ length: currentMazeSize }, () => Array(currentMazeSize).fill(false));
  const queue = [{ x: 0, y: 0 }];
  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];

  while (queue.length > 0) {
    const { x, y } = queue.shift();
    if (x === currentMazeSize - 1 && y === currentMazeSize - 1) return true;
    for (let dir of directions) {
      const nx = x + dir.x;
      const ny = y + dir.y;
      if (
        nx >= 0 && nx < currentMazeSize &&
        ny >= 0 && ny < currentMazeSize &&
        !visited[ny][nx] &&
        !mazeGrid[ny][nx].classList.contains("wall")
      ) {
        visited[ny][nx] = true;
        queue.push({ x: nx, y: ny });
      }
    }
  }
  return false;
}

function startGame() {
  currentMazeSize = baseMazeSize + level - 1;
  playerPosition = { x: 0, y: 0 };
  goalPosition = { x: currentMazeSize - 1, y: currentMazeSize - 1 };
  timeLeft = 30 + level * 5;
  document.getElementById("message").textContent = "";
  document.getElementById("maze").classList.remove("reveal");
  document.getElementById("level-score").textContent = `Level: ${level} | Score: ${score}`;
  createMaze();
  document.addEventListener("keydown", movePlayer);
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("message").textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      endGame("Time's up! Game over.");
    }
  }, 1000);
}

function movePlayer(e) {
  const dir = { x: 0, y: 0 };
  if (e.key === "ArrowUp") dir.y = -1;
  if (e.key === "ArrowDown") dir.y = 1;
  if (e.key === "ArrowLeft") dir.x = -1;
  if (e.key === "ArrowRight") dir.x = 1;

  const newX = playerPosition.x + dir.x;
  const newY = playerPosition.y + dir.y;

  if (
    newX >= 0 && newX < currentMazeSize &&
    newY >= 0 && newY < currentMazeSize &&
    !mazeGrid[newY][newX].classList.contains("wall")
  ) {
    mazeGrid[playerPosition.y][playerPosition.x].classList.remove("player");
    playerPosition = { x: newX, y: newY };
    mazeGrid[playerPosition.y][playerPosition.x].classList.add("player");

    if (playerPosition.x === goalPosition.x && playerPosition.y === goalPosition.y) {
      score += 100 * level;
      level++;
      document.getElementById("message").textContent = `Level ${level - 1} completed! Starting level ${level}...`;
      clearInterval(timer);
      setTimeout(startGame, 1500);
    }
  } else if (newX >= 0 && newX < currentMazeSize && newY >= 0 && newY < currentMazeSize) {
    endGame("You hit a wall! Game over.");
  }
}

function endGame(message) {
  clearInterval(timer);
  document.removeEventListener("keydown", movePlayer);
  document.getElementById("maze").classList.add("reveal");
  document.getElementById("message").textContent = `${message} Final Score: ${score}`;
}

function restartGame() {
  level = 1;
  score = 0;
  startGame();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

window.onload = () => {
  const container = document.querySelector(".game-container");
  const levelScoreDisplay = document.createElement("div");
  levelScoreDisplay.id = "level-score";
  container.insertBefore(levelScoreDisplay, document.getElementById("maze"));

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Restart Game";
  restartBtn.id = "restart-btn";
  restartBtn.onclick = restartGame;
  container.appendChild(restartBtn);

  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Toggle Dark Mode";
  toggleBtn.id = "toggle-mode";
  toggleBtn.onclick = toggleDarkMode;
  container.appendChild(toggleBtn);

  startGame();
};
