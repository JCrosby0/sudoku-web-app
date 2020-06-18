/**
 * Here are teh functions used to check sudoku grid logic
 * They are separated for reference across components,
 * and to minimise no vue code in components
 * 'this' should not need to be defined in here
 */

const rowFromIndex = index => Math.floor(index / 9);
const colFromIndex = index => index % 9;
const boxFromIndex = index =>
  Math.floor(colFromIndex(index) / 3) + 3 * Math.floor(rowFromIndex(index) / 3);

const indexFromCoords = function(cell) {
  return cell.rowId * 9 + cell.cellId;
};
// Chess Constraints
const testKnightCondition = (index, row, col) => {
  // row abs.difference of two and col abs.difference of 1 of vice versa
  return (
    (Math.abs(rowFromIndex(index) - row) == 1 &&
      Math.abs(colFromIndex(index) - col) == 2) ||
    (Math.abs(rowFromIndex(index) - row) == 2 &&
      Math.abs(colFromIndex(index) - col) == 1)
  );
};
const testQueenCondition = (index, row, col) => {
  // a diagonal will have:
  // - the same difference between row and col of two points,
  // - the same sum between row and col of two points
  const col_ind = colFromIndex(index);
  const row_ind = rowFromIndex(index);
  // shared column
  if (col_ind === col) return true;
  // shared row
  if (row_ind === row) return true;
  // shared NW-SE diagonal
  if (col_ind - row_ind === col - row) return true;
  // shared NE-SW diagonal
  if (col_ind + row_ind === col + row) return true;
  return false;
};
const testKingCondition = (index, row, col) => {
  // both row and column must have abs(difference <=1
  return (
    Math.abs(rowFromIndex(index) - row) <= 1 &&
    Math.abs(colFromIndex(index) - col) <= 1
  );
};

const toggleKey = function(array, key) {
  const keyNum = Number.parseInt(key);
  if (isNaN(keyNum)) return array;
  const index = array.indexOf(keyNum);
  if (index >= 0) {
    array.splice(index, 1);
  } else {
    array.push(keyNum);
  }
  return array.sort();
};

module.exports = {
  rowFromIndex,
  colFromIndex,
  boxFromIndex,
  indexFromCoords,
  testKnightCondition,
  testQueenCondition,
  testKingCondition,
  toggleKey
};
