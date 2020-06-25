/**
 * Here are teh functions used to check sudoku grid logic
 * They are separated for reference across components,
 * and to minimise no vue code in components
 * 'this' should not need to be defined in here
 */

const rowFromIndex = (index, size) => Math.floor(index / size);
const colFromIndex = (index, size) => index % size;
const boxFromIndex = (index, size) =>
  // TODO how to arrange boxes in non 3x3 case?
  // eg 6x6 wants 3x2 boxes, potentially in 2 arrangements...
  Math.floor(colFromIndex(index, size) / 3) +
  3 * Math.floor(rowFromIndex(index, size) / 3);

const indexFromCoords = (cell, size) => {
  console.log("size: ", size);
  console.log("cell: ", cell);

  return cell.rowId * size + cell.cellId;
};
// Chess Constraints
const testKnightCondition = (index, row, col, size) => {
  // row abs.difference of two and col abs.difference of 1 of vice versa
  return (
    (Math.abs(rowFromIndex(index, size) - row) == 1 &&
      Math.abs(colFromIndex(index, size) - col) == 2) ||
    (Math.abs(rowFromIndex(index, size) - row) == 2 &&
      Math.abs(colFromIndex(index, size) - col) == 1)
  );
};
const testQueenCondition = (index, row, col, size) => {
  // a diagonal will have:
  // - the same difference between row and col of two points,
  // - the same sum between row and col of two points
  const col_ind = colFromIndex(index, size);
  const row_ind = rowFromIndex(index, size);
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
const testKingCondition = (index, row, col, size) => {
  // both row and column must have abs(difference <=1
  return (
    Math.abs(rowFromIndex(index, size) - row) <= 1 &&
    Math.abs(colFromIndex(index, size) - col) <= 1
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
