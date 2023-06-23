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
let boardSize = 7;
let userSizeChoice = 7;
let playerBoard = createBoard(7);
let cpuBoard = createBoard(7);
let playerState = [];
let cpuState = [];


// Takes an input (x) and creates a board div with x squared nodes
// it also sets the boardSize var to use in creating the game state 



function createShips() {


}




























function createBoard(size) {
    boardSize = size * size;
    rootVars.style.setProperty('--board-size', size);
    let newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'board');
    mainSection.append(newDiv);
    for (let i = 0; i < boardSize; i++) {
        let newNode = document.createElement('div');
        newNode.setAttribute('class', 'node');
        newDiv.append(newNode);
    }
    return newDiv;
}


// Clears all elements from the main game area to allow to switch game display
// function clearMain() {
    //     const mainEls = document.querySelectorAll('main > *');
    //     mainEls.forEach((el) => el.remove());
    // }