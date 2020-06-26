import * as fn from "./sudokuFunctions";

const testUniqueLength = (array) => {
  return array.length && array.length == (Array.from(new Set(array))).length
};

const testFullArray = (array) => {
  if (array.length !== 81) {
    alert('Unable to check non-standard sudoku grid');
    return false
  }
  return true
}
// turn full array into an array of rows
const rows = (array) => {
  console.log('preparing rows for testing');
  if (!testFullArray(array)) return false;
  const rowArray = []
  while (array.length) {
    rowArray.push(array.splice(0, 9))
  }
  return rowArray
};

// turn full array into an array of cols
const cols = (array) => {
  console.log('preparing cols for testing');
  if (!testFullArray(array)) return false;
  const colArray = new Array(9).fill([]);
  array.forEach((c, i) => {
    colArray[fn.colFromIndex(i, 9)].push(c)
  })
  return colArray
};
const boxes = (array) => {
  console.log('preparing boxes for testing');
  if (!testFullArray(array)) return false;
  const boxArray = new Array(9).fill([]);
  array.forEach((c, i) => {
    boxArray[fn.boxFromIndex(i, 9)].push(c)
  })
  return boxArray
};
const diagonals = (array) => {
  console.log('preparing diagonals for testing');
  if (!testFullArray(array)) return false;
  const diagArray = new Array(2).fill([]);
  array.forEach((c, i) => {
    if (i != 0 && i % 8 == 0) {
      diagArray[0].push(c)
    } else if (i % 10 == 0) {
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
