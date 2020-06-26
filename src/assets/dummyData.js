let emptyCellArray = new Array(81).fill({});
const firstCell = (i) => {
  if (i === 0) return 1
  return Math.random() < 0.3 ? Math.floor(Math.random() * 10) : null
};
emptyCellArray.forEach((_, i) => {
  emptyCellArray[i] = {
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

module.exports = emptyCellArray;
