### Sudoku Web App
This app is built using VueJs, and is a Sudoku grid.
It allows:
- Value, candidate and corner notation
- Cell highlighting, including row/column/box, matching digits, king/knight/available cell highlighting.
- Load puzzle
- Undo/Redo stack
- Keyboard entry, including modifiers for notation


# sudoku-web-app

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### TODO:

## Bugs:

- undo redo stack -- fails after loading a puzzle

- check puzzle could (offer to) highlight bad cells

- reset puzzle should return it to the loaded state, not an empty grid

- some tab select / active region issues, ie click on body before can input

-E2E Cypress tests failing keyboard input for some reason

- Check function not returing errors properly

## Enhance:

- List out functionality required for grid decoration

- Set up data structure for regions (killer, thermo etc)

- color back ground inputs

- puzzle validation for additional rules

- Use OpenCV to interpret sudoku puzzle from image and populate grid
