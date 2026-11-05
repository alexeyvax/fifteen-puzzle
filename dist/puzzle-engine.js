export function solvedBoard(size) {
  return Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size));
}

export function neighbors(index, size) {
  return [index - size, index + size, index - 1, index + 1].filter(
    (next) => next >= 0 && next < size * size &&
      Math.abs(Math.floor(next / size) - Math.floor(index / size)) +
      Math.abs(next % size - index % size) === 1,
  );
}

export function isSolved(board) {
  return board.every((tile, i) => tile === (i + 1) % board.length);
}

export function scramble(size, steps = size * size * 8, random = Math.random) {
  const board = solvedBoard(size);
  let empty = board.length - 1;
  let previous = -1;
  for (let i = 0; i < steps; i++) {
    const options = neighbors(empty, size).filter((index) => index !== previous);
    const next = options[Math.floor(random() * options.length)];
    [board[empty], board[next]] = [board[next], board[empty]];
    previous = empty;
    empty = next;
  }
  if (isSolved(board)) {
    const next = neighbors(empty, size)[0];
    [board[empty], board[next]] = [board[next], board[empty]];
  }
  return board;
}
