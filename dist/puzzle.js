import { solvedBoard, neighbors, isSolved, scramble } from './puzzle-engine.js';

const boardElement = document.querySelector('#puzzle-board');
const movesElement = document.querySelector('#move-count');
const timerElement = document.querySelector('#timer');
const message = document.querySelector('#game-message');
const labels = { 3: 'Easy', 4: 'Classic', 5: 'Hard', 6: 'Expert' };
let size = 4;
// Start within a few moves of a win so the preview is easy to explore.
let board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 12, 13, 14, 11, 15];
let moves = 0;
let startedAt = null;
let finished = false;
let timerId = null;
let elapsed = 0;
let sliding = false;
const tiles = new Map();

function updateTimer() {
  const seconds = Math.floor((elapsed + (startedAt === null ? 0 : performance.now() - startedAt)) / 1000);
  timerElement.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function draw(rebuild = false) {
  if (rebuild) {
    boardElement.replaceChildren();
    tiles.clear();
    for (let value = 1; value < size * size; value++) {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'tile';
      tile.textContent = String(value);
      tile.addEventListener('click', () => move(value));
      tiles.set(value, tile);
      boardElement.append(tile);
    }
  }
  boardElement.style.setProperty('--size', size);
  const legal = neighbors(board.indexOf(0), size);
  board.forEach((value, index) => {
    if (!value) return;
    const tile = tiles.get(value);
    tile.style.setProperty('--row', Math.floor(index / size));
    tile.style.setProperty('--col', index % size);
    const movable = legal.includes(index) && !finished;
    tile.classList.toggle('movable', movable);
    tile.disabled = !movable;
    tile.setAttribute('aria-label', `Tile ${value}, row ${Math.floor(index / size) + 1}, column ${index % size + 1}${movable ? ', slide into empty space' : ''}`);
  });
  movesElement.textContent = String(moves);
}

function move(value) {
  if (finished || sliding) return;
  const index = board.indexOf(value);
  const empty = board.indexOf(0);
  if (!neighbors(empty, size).includes(index)) return;
  if (startedAt === null && !document.hidden) {
    startedAt = performance.now();
    timerId = setInterval(updateTimer, 250);
  }
  sliding = true;
  setTimeout(() => { sliding = false; }, 170);
  [board[index], board[empty]] = [board[empty], board[index]];
  moves++;
  finished = isSolved(board);
  draw();
  if (finished) {
    elapsed += startedAt === null ? 0 : performance.now() - startedAt;
    startedAt = null;
    clearInterval(timerId);
    updateTimer();
    message.textContent = `Beautifully done! Solved in ${moves} moves.`;
    document.querySelector('#shuffle').focus({ preventScroll: true });
  } else {
    message.textContent = 'Slide the tiles into order. You’ve got this.';
    // Retain a useful keyboard focus after the moved tile becomes disabled.
    const next = neighbors(board.indexOf(0), size).map(i => tiles.get(board[i])).find(tile => tile && !tile.disabled);
    if (document.activeElement === document.body && next) next.focus({ preventScroll: true });
  }
}

function reset(nextSize = size) {
  size = nextSize;
  clearInterval(timerId);
  startedAt = null;
  elapsed = 0;
  moves = 0;
  finished = false;
  sliding = false;
  board = scramble(size);
  message.textContent = 'A fresh puzzle. Make yourself a little space.';
  document.querySelector('#board-label').textContent = `${labels[size]} · ${size} × ${size}`;
  boardElement.setAttribute('aria-label', `Interactive ${labels[size].toLowerCase()} ${size} by ${size} sliding puzzle. Move a tile next to the empty space.`);
  updateTimer();
  draw(true);
}

document.querySelector('#shuffle').addEventListener('click', () => reset());
document.querySelectorAll('.theme-dot').forEach(button => {
  button.addEventListener('click', () => {
    document.body.dataset.theme = button.dataset.theme;
    document.querySelectorAll('.theme-dot').forEach(option => {
      const selected = option === button;
      option.classList.toggle('active', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
  });
});
document.querySelectorAll('.mini-board').forEach(element => {
  const gridSize = Number(element.dataset.grid);
  element.style.setProperty('--size', gridSize);
  solvedBoard(gridSize).forEach(value => {
    const tile = document.createElement('span');
    tile.textContent = value || '';
    element.append(tile);
  });
});
document.querySelectorAll('.level-card').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.level-card').forEach(option => {
      const selected = option === button;
      option.classList.toggle('selected', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
    reset(Number(button.dataset.size));
    document.querySelector('#try-it').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    // Keep keyboard users with the preview they selected.
    const next = neighbors(board.indexOf(0), size).map(i => tiles.get(board[i])).find(Boolean);
    if (next) next.focus({ preventScroll: true });
  });
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && startedAt !== null) {
    elapsed += performance.now() - startedAt;
    startedAt = null;
    clearInterval(timerId);
  } else if (!document.hidden && moves > 0 && !finished && startedAt === null) {
    startedAt = performance.now();
    timerId = setInterval(updateTimer, 250);
  }
});
draw(true);
