const emptyCellJSON = JSON.stringify({
    value: null,
    notesTop: [],
    notesMid: [],
    bgColor: null,
    bgImg: null,
    fixed: null,
    error: null,
});

let dummyCellArray = new Array(81).fill({});
const firstCell = (i) => {
  if (i === 0) return 1
  return Math.random() < 0.3 ? Math.floor(Math.random() * 10) : null
};
dummyCellArray.forEach((_, i) => {
  dummyCellArray[i] = {
    value: firstCell(i),
    notesTop: Math.random() < 0.5 ? [1, 2, 3, 4, 5, 6, 7] : [],
    notesMid: Math.random() < 0.5 ? [3, 4] : [],
    bgColor: null,
    bgImg: null,
    fixed: Math.random() < 0.1,
    error: Math.random() < 0.1,
    index: i
  };
});

let validRows = new Array(81).fill({})
validRows.forEach((_, i) => {
  validRows[i] = Object.assign({}, JSON.parse(emptyCellJSON))  
  validRows[i].value = i % 9 + 1,
  validRows[i].index = i
});
let validCols = new Array(81).fill({});
validCols.forEach((_, i) => {
  validCols[i] = Object.assign({}, JSON.parse(emptyCellJSON)) 
  validCols[i].value = i ? Math.ceil(i / 9) : 1,
  validCols[i].index = i
});;
let validBoxes = new Array(81).fill({});
validBoxes.forEach((_, i) => {
  validBoxes[i] = Object.assign({}, JSON.parse(emptyCellJSON)) 
  validBoxes[i].value = ((Math.ceil(i / 9) % 3) * 3) + (i % 9) + 1,
  validBoxes[i].index = 1
});
const solutionString = "415962378763185429928374561831649257672531984549827613396218745157496832284753196";
let validGrid = new Array(81).fill({});
validGrid.forEach((_, i) => {
  validGrid[i] = Object.assign({}, JSON.parse(emptyCellJSON))
  validGrid[i].value = (solutionString.slice(i, i + 1)) && solutionString.slice(i, i + 1);
  validGrid[i].index = i
  validGrid[i].fixed = (validGrid[i].value)
});

const stringEasy   = "030096802605082040100000096016070050003860009007905620301400060400759000029000704"
const stringMedium = "000000014004090802500030007900800201000023700800000000600040000050010000090072605"
const stringHard   = "200090073000000000800502900038000200000470000000600001500060040006350800009000000"

const gridGenerator = (string) => {
  let validGrid = new Array(81).fill({});
  validGrid.forEach((_, i) => {
    const value = string.slice(i, i + 1)
    validGrid[i] = Object.assign({}, JSON.parse(emptyCellJSON))
    validGrid[i].value = value !== "0" ? value : null
    validGrid[i].index = i
    validGrid[i].fixed = (validGrid[i].value)
  });
  return validGrid
}

const demoEasy = gridGenerator(stringEasy);
const demoMedium = gridGenerator(stringMedium);
const demoHard = gridGenerator(stringHard);

module.exports = {
  dummyCellArray,
  validRows,
  validCols,
  validBoxes,
  validGrid,
  demoEasy,
  demoMedium,
  demoHard,
  gridGenerator
};
