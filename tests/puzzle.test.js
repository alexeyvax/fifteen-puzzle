import test from 'node:test';
import assert from 'node:assert/strict';
import { solvedBoard, neighbors, isSolved, scramble } from '../dist/puzzle-engine.js';

function solvable(board, size) {
  const numbers = board.filter(Boolean);
  let inversions = 0;
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] > numbers[j]) inversions++;
    }
  }
  if (size % 2) return inversions % 2 === 0;
  const emptyRowFromBottom = size - Math.floor(board.indexOf(0) / size);
  return (inversions + emptyRowFromBottom) % 2 === 1;
}

test('neighbors never wrap from one row to the next', () => {
  assert.deepEqual(neighbors(3, 4).sort((a, b) => a - b), [2, 7]);
  assert.deepEqual(neighbors(4, 4).sort((a, b) => a - b), [0, 5, 8]);
  assert.deepEqual(neighbors(15, 4).sort((a, b) => a - b), [11, 14]);
});

test('every difficulty produces complete, unsolved, solvable boards', () => {
  let seed = 42;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (const size of [3, 4, 5, 6]) {
    for (let attempt = 0; attempt < 100; attempt++) {
      const board = scramble(size, size * size * 8, random);
      assert.deepEqual([...board].sort((a, b) => a - b), Array.from({ length: size * size }, (_, i) => i));
      assert.equal(isSolved(board), false);
      assert.equal(solvable(board, size), true);
    }
  }
});

test('initial preview can be solved with two legal moves', () => {
  const board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 12, 13, 14, 11, 15];
  for (const value of [11, 15]) {
    const empty = board.indexOf(0), index = board.indexOf(value);
    assert.ok(neighbors(empty, 4).includes(index));
    [board[empty], board[index]] = [board[index], board[empty]];
  }
  assert.deepEqual(board, solvedBoard(4));
  assert.equal(isSolved(board), true);
});
