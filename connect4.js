/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
//WIDTH = x
const WIDTH = 7; // WIDTH = td = columns
//HEIGHT = y
const HEIGHT = 6; // HEIGHT = tr = rows

let currPlayer = 1; // active player: 1 or 2
// board variable is set globally
//ideally I should have used const to declared the board array variable
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard () {
  // Done TODO: set "board" to empty HEIGHT x WIDTH matrix array
  //Setting 'board' to empty height x width creates a 2d array
  //that has a height of 6 rows by a width of 7 columns
  //set variable y (columns) to zero; y iterates thru columns until false
  for (let y = 0; y < HEIGHT; y++) {
    //calling board[y] = empty array;
    board[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      //creates an empty/undefined array
      board[y][x] = null;
    }
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard () {
  // DONE TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  //Using html DOM query selector to select html id of board
  const htmlBoard = document.querySelector ('#board');
  // DONE TODO: add comment for this code
  //creates an HTML table row (tr) element on top of board
  const top = document.createElement ('tr');
  // sets attribute id to column-top
  top.setAttribute ('id', 'column-top');
  // add eventListener & assigns a click event handler to the row when clicked
  top.addEventListener ('click', handleClick);
  // width is set to zero, iterate thru columns (td)
  for (let x = 0; x < WIDTH; x++) {
    //creates a variable called headCell that references table data (td) element
    const headCell = document.createElement ('td');
    //if id exists, update it to x else create an id with the value x
    headCell.setAttribute ('id', x);
    //adds td to board
    top.append (headCell);
  }

  //add tr to top of html board
  htmlBoard.append (top);

  //DONE TODO: add comment for this code
  //td = table data
  //tr = table row
  //set variable y to initialize  0; if y is less than height; keep iterating until false
  //set height to zero, iterate thru rows, add one until false
  for (let y = 0; y < HEIGHT; y++) {
    //create table row (tr) element for height
    const row = document.createElement ('tr');

    //set width to zero, iterate thru columns
    for (let x = 0; x < WIDTH; x++) {
      //create table data for WIDTH and fills it with cell elements/data?
      const cell = document.createElement ('td');

      //sets each (cell) td element with an id of y-x
      cell.setAttribute ('id', `${y}-${x}`);

      // add cell (td) to row
      row.append (cell);
    }

    //add (tr) row to html board
    htmlBoard.append (row);
  }
}

function findSpotForCol (x) {
  // DONE TODO: write the real version of this, rather than always returning 0
  //drops piece at bottom of column -- starts at bottom of column
  //y = height - 1 -> last spot in the game board
  //y > 0 -> keep working from the bottom of game board to top
  //y-- -> keep decrementing until false; ends loops
  //changed y > 0; to y >= 0. This was causing the the piece to not show up on index[0] on the game board
  for (let y = HEIGHT - 1; y >= 0; y--) {
    //checks board at [y][x] position to see if null (absence of value); if so, return y
    if (board[y][x] === null) return y;
    //console.log (`this is x at column: ${y}`);
    console.log (`this is a move at column: ${x}`);
  }
  return null;
  //return 0;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable (y, x) {
  // DONE TODO: make a div and insert into correct table cell
  const div = document.createElement ('div');
  div.classList.add ('piece');
  let spot = document.getElementById (`${y}-${x}`);
  div.classList.add (`p${currPlayer}`);
  spot.append (div);
  //div.classList.add ('id', `${y}-${x}]`);
  // div.classList.add ('column-top', `${y}-${x}]`);
}

/** endGame: announce game end */

function endGame (msg) {
  // DONE TODO: pop up alert message
  alert (msg);
  console.log ('game over');
}

/** handleClick: handle click of column top to play piece */

function handleClick (evt) {
  //Checks game for win, if one player wins, ends game.
  if (checkForWin ()) {
    return endGame (
      `Game Over. Player ${currPlayer} won. Hit refresh to play again!`
    );
  }
  // get x from ID of clicked cell
  //row = top -> ID -> tr -> #column-top -> height -> y
  //cell = headCell -> id -> td -> width -> x

  //create variable for evt
  //gets x from id of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol (x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // DONE TODO: add line to update in-memory board
  //updates board at current index and sets it to currPlayer
  board[y][x] = currPlayer;
  placeInTable (y, x);

  // check for win
  if (checkForWin ()) {
    return endGame (`Player ${currPlayer} won!`);
  }

  // check for tie
  // DONE TODO: check if all cells in board are filled; if so call, call endGame
  //using .every() and callback function to check all elements in an array (cells)
  //and returns a boolean value. Reference this solution from
  //https://stackoverflow.com/questions/62727756/connect-4-check-for-win-isnt-working-how-do-i-fix
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
  //used checkForWin instead of board.every(row => row.every(Boolean)) because I think it makes sense to check whether each cell
  //is filled for a win
  if (board.every (cells => cells.every (cell => cell))) {
    //console.log ('Tie game');
    return endGame ('Tie game');
  }

  // switch players
  // DONE TODO: switch currPlayer 1 <-> 2
  if (currPlayer === 1) {
    currPlayer = 2;
  } else {
    currPlayer = 1;
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin () {
  function _win (cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every (
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //DONE  TODO: read and understand this code. Add comments to help you.
  //row = top -> ID -> tr -> #column-top -> height -> y
  //loops thru each row element
  for (let y = 0; y < HEIGHT; y++) {
    //cell = headCell -> id -> td -> width -> x
    //loops thru each cell element
    for (let x = 0; x < WIDTH; x++) {
      // Random thought: The arrays below kind of remind me of a cartesian grid layout
      //horizontal array increments by one as it goes down each row
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      //vertical array increments by one as it goes down each column
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // diagonal right array increments by 1 as
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      //diagonal left array
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      //checks for win in multiple scenarios; either horizontal or vertical or diagonal right or diagonal left
      if (_win (horiz) || _win (vert) || _win (diagDR) || _win (diagDL)) {
        // if any of the logical operators || return true
        return true;
      }
    }
  }
}

makeBoard (board);
makeHtmlBoard (board);
