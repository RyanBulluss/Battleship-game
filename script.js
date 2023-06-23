// constants
const mainSection = document.querySelector('main');
const rootVars = document.querySelector(':root');



// Variables
let boardSize = 0;
let userSizeChoice = 7;







// createBoard(userSizeChoice);


// Clears all elements from the main game area to allow to switch game display
function clearMain() {
    const mainEls = document.querySelectorAll('main > *');
    mainEls.forEach((el) => el.remove());
}


// Takes an input (x) and creates a board div with x squared nodes
// it also sets the boardSize var to use in creating the game state 
function createBoard(size) {
    boardSize = size * size;
    rootVars.style.setProperty('--board-size', size);
    let newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'board');
    mainSection.prepend(newDiv);
    for (let i = 0; i < boardSize; i++) {
        let newNode = document.createElement('div');
        newNode.setAttribute('class', 'node');
        newDiv.prepend(newNode);
    }
}

