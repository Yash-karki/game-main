const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const tileSize = 50;
let currentPlayer = 1;
let positions = { 1: 0, 2: 0 };
const boardWidth = canvas.width;
const boardHeight = canvas.height;
// Updated snake and ladder logic based on new board image
const snakes = { 98: 57, 92: 74, 76: 45, 50: 12, 41: 19 };
const ladders = { 8: 46, 15: 42, 35: 54, 58: 79, 67: 91 };
// Piece placement coordinates (adjust accordingly)
const playerColors = {
  1: localStorage.getItem('player1Color') || 'red',
  2: localStorage.getItem('player2Color') || 'blue'
};

const isBotGame = localStorage.getItem('mode') === 'bot';

function drawPlayers() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p = 1; p <= 2; p++) {
    const pos = positions[p];
    const row = Math.floor(pos / 10);
    let col = pos % 10;
    if (row % 2 === 1) col = 9 - col;
    const x = col * tileSize + tileSize / 2;
    const y = 450 - row * tileSize + tileSize / 2;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = playerColors[p];
    ctx.fill();
    ctx.stroke();
  }
}

function rollDice() {
  const roll = Math.ceil(Math.random() * 6);
  let status = document.getElementById('status');
  status.textContent = `Player ${currentPlayer} rolled a ${roll}`;
  let newPosition = positions[currentPlayer] + roll;
  if (newPosition > 99) newPosition = 99;

  animateMove(currentPlayer, positions[currentPlayer], newPosition, () => {
    positions[currentPlayer] = newPosition;
    const finalPos = snakes[newPosition] || ladders[newPosition] || newPosition;
    if (finalPos !== newPosition) {
      animateMove(currentPlayer, newPosition, finalPos, () => {
        positions[currentPlayer] = finalPos;
        checkWin();
      });
    } else {
      checkWin();
    }
  });
}

function checkWin() {
  drawPlayers();
  if (positions[currentPlayer] === 99) {
    setTimeout(() => alert(`Player ${currentPlayer} wins!`), 100);
    positions = { 1: 0, 2: 0 };
    return;
  }
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  if (isBotGame && currentPlayer === 2) {
    document.getElementById('rollBtn').disabled = true;
    setTimeout(() => {
      rollDice();
      document.getElementById('rollBtn').disabled = false;
    }, 2000);
  }
}

function animateMove(player, from, to, callback) {
  const step = from < to ? 1 : -1;
  let current = from;
  const interval = setInterval(() => {
    positions[player] = current;
    drawPlayers();
    current += step;
    if ((step === 1 && current > to) || (step === -1 && current < to)) {
      clearInterval(interval);
      callback();
    }
  }, 400);
}

drawPlayers();
