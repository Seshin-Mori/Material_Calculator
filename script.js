//定数の定義
const boardSize = 8;
const cellSize = 50;
const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status-text");

const board = new Array(boardSize)
  .fill(null)
  .map(() => new Array(boardSize).fill(0));

function initialize() {
  // ゲームボードの初期化
  gameBoard.style.width = `${boardSize * cellSize}px`;
  gameBoard.style.height = `${boardSize * cellSize}px`;

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.style.width = `${cellSize}px`;
      cell.style.height = `${cellSize}px`;
      cell.addEventListener("click", () => handleCellClick(i, j));
      gameBoard.appendChild(cell);
    }
  }

  // 盤面の初期化
  board[3][3] = board[4][4] = 1;
  board[3][4] = board[4][3] = -1;
  updateBoard();
}

function updateBoard() {
  // DOMの更新
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = gameBoard.children[i * boardSize + j];
      if (board[i][j] === 1) {
        cell.classList.add("black");
        cell.classList.remove("white");
      } else if (board[i][j] === -1) {
        cell.classList.add("white");
        cell.classList.remove("black");
      } else {
        cell.classList.remove("black");
        cell.classList.remove("white");
      }
    }
  }
}

function handleCellClick(i, j) {
  if (board[i][j] !== 0 || !isValidMove(i, j, 1)) {
    return;
  }

  placePiece(i, j, 1);
  updateBoard();

  // コンピュータの手番
  setTimeout(() => {
    const move = getRandomValidMove(-1);
    if (move) {
      placePiece(move[0], move[1], -1);
      updateBoard();
    }
  }, 500);
}

function isValidMove(x, y, player) {
  if (board[x][y] !== 0) {
    return false;
  }

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [dx, dy] of directions) {
    if (canFlip(x, y, dx, dy, player)) {
      return true;
    }
  }

  return false;
}

function canFlip(x, y, dx, dy, player) {
  let i = x + dx;
  let j = y + dy;

  if (!isInBounds(i, j) || board[i][j] !== -player) {
    return false;
  }

  while (isInBounds(i, j) && board[i][j] !== 0) {
    if (board[i][j] === player) {
      return true;
    }

    i += dx;
    j += dy;
  }

  return false;
}

function placePiece(x, y, player) {
  board[x][y] = player;

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [dx, dy] of directions) {
    if (canFlip(x, y, dx, dy, player)) {
      let i = x + dx;
      let j = y + dy;

      while (isInBounds(i, j) && board[i][j] === -player) {
        board[i][j] = player;
        i += dx;
        j += dy;
      }
    }
  }
}

function isInBounds(x, y) {
  return x >= 0 && x < boardSize && y >= 0 && y < boardSize;
}

function getRandomValidMove(player) {
  const validMoves = [];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (isValidMove(i, j, player)) {
        validMoves.push([i, j]);
      }
    }
  }

  if (validMoves.length === 0) {
    return null;
  }

  const index = Math.floor(Math.random() * validMoves.length);
  return validMoves[index];
}

initialize();
