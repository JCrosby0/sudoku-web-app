const fn = require('./sudokuFunctions')

const testUniqueLength = (array) => {
  return array.length && array.length == (Array.from(new Set(array))).length
};
const validateArray = (array) => {
  return (array.length > 81) ? array.slice(0, 81) : array
}
const testFullArray = (array) => {
  if (array.length !== 81) {
    console.warn('Unable to check non-standard sudoku grid, array length: ' + array.length);
    return false
  }
  return true
}
// turn full array into an array of rows
const rows = (array) => {
  array = validateArray(array)
  const test = testFullArray(array)
  if (!test && array.length > 81) {
    array.length = 81
  }
  else if (!test) return false;
  const rowArray = new Array(9).fill();
  rowArray.forEach((_,i) => rowArray[i] = []);
  array.forEach((c, i) => {
    rowArray[fn.rowFromIndex(i, 9)].push(c)
  })
  return rowArray
};

// turn full array into an array of cols
const cols = (array) => {
  array = validateArray(array)
  const test = testFullArray(array)
  if (!test) return false;
  const colArray = new Array(9).fill();
  colArray.forEach((_, i) => colArray[i] = []);
  array.forEach((c, i) => {
    colArray[fn.colFromIndex(i, 9)].push(c)
  })
  return colArray
};
const boxes = (array) => {
  array = validateArray(array)
  const test = testFullArray(array)
  if (!test) return false;
  const boxArray = new Array(9).fill();
  boxArray.forEach((_, i) => boxArray[i] = [])
  array.forEach((c, i) => {
    boxArray[fn.boxFromIndex(i, 9)].push(c)
  })
  return boxArray
};
const diagonals = (array) => {
  array = validateArray(array)
  const test = testFullArray(array)
  if (!test) return false;
  const diagArray = [
    [],
    []
  ];
  array.forEach((c, i) => {
    if (i !== 0 && i !== 80 && i % 8 === 0) {
      diagArray[0].push(c)
    }
    if (i % 10 === 0) {
      diagArray[1].push(c)
    }
  })
  return diagArray
};

module.exports = {
  testUniqueLength,
  rows,
  cols,
  boxes,
  diagonals
};
