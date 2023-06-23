// constants
const mainSection = document.querySelector('main');
const rootVars = document.querySelector(':root');
let ships = {
    carrier: 5,
    battleship: 4,
    cruise: 3,
    submarine: 3,
    destroyer: 2
}




// Variables
let userSizeChoice = 10;
let boardSize;
let playerBoard;
let cpuBoard;
let playerState;
let cpuState;




init();

function init() {
    playerBoard = createBoard('p', userSizeChoice);
    cpuBoard = createBoard('c', userSizeChoice);
    playerState = createState(userSizeChoice);
    cpuState = createState(userSizeChoice);
    boardSize = userSizeChoice * userSizeChoice;
}

function renderShips() {


}


























function createState(size) {
    let arrRow = [];
    for (let i = 0; i < size; i++) {
        let arrCol = [];
        for (let j = 0; j < size; j++) {
            arrCol.push(0)
        }
        arrRow.push(arrCol);
    }
    return arrRow;
}


// Takes an input (x) and creates a board div with x squared nodes
// it also sets the boardSize var to use in creating the game state
// it gives board class and node class as well as id index with p or c for player or cpu
function createBoard(char, size) {
    boardSize = size * size;
    rootVars.style.setProperty('--board-size', size);
    let newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'board');
    mainSection.append(newDiv);
    for (let i = 0; i < boardSize; i++) {
        let newNode = document.createElement('div');
        newNode.setAttribute('class', 'node');
        newNode.setAttribute('id', `${char + i}`);
        newDiv.append(newNode);
    }
    return newDiv;
}


// Clears all elements from the main game area to allow to switch game display
// function clearMain() {
    //     const mainEls = document.querySelectorAll('main > *');
    //     mainEls.forEach((el) => el.remove());
    // }