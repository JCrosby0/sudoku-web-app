let emptyCellArray = new Array(81).fill({});
emptyCellArray.forEach((_, i) => {
  emptyCellArray[i] = {
    value: Math.random() < 0.3 ? Math.floor(Math.random() * 10) : null,
    notesTop: Math.random() < 0.5 ? [1, 2, 3, 4, 5, 6, 7] : [],
    notesMid: Math.random() < 0.5 ? [3, 4] : [],
    bgColor: null,
    bgImg: null,
    cursor: false,
    selected: false,
    fixed: Math.random() < 0.1 ? true : false,
    error: Math.random() < 0.1 ? true : false
  };
});

module.exports = emptyCellArray;
