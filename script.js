// constants
const mainSection = document.querySelector('main');
const rootVars = document.querySelector(':root');
const messageSection = document.getElementById('message-section');
const controlsSection = document.getElementById('controls-section');
const shipContainer = document.querySelector('.ship-container');
const rotateButton = document.getElementById('rotate');

// Each ship stored in object to reference the lengths
const ships = {
    carrier: 5,
    battleship: 4,
    cruise: 3,
    submarine: 3,
    destroyer: 2
}

// Ships in an array to make looping over them easier
const shipsArray = [ships.carrier, ships.battleship, ships.cruise, ships.submarine, ships.destroyer];




// Variables
let userSizeChoice = 7;
let boardSize = 49;
let playerBoard;
let cpuBoard;
let playerState;
let cpuState;




init();





function init() {
    playerBoard = createBoard(userSizeChoice);
    cpuBoard = createBoard(userSizeChoice);
    playerState = createState(boardSize);
    cpuState = createState(boardSize);
}

function render() {
    renderShips();
    renderControls()
}


// rotateButton.addEventListener('click', rotateShips);





// random start index, random direction(0:up 1:right 2:down 3:left)
function randomShip(state, ship) {
    let firstIndex = rng(boardSize);
    let direction = rng(4);
    console.log(firstIndex);

    for (let i = 0; i < ship.length; i++) {
        switch(direction) {
            case 0:
                state[firstIndex - (userSizeChoice * i)] = 1;
            break;
            case 1:
                state[firstIndex + i] = 1;
            break;
            case 2:
                state[firstIndex + (userSizeChoice * i)] = 1;
            break;
            case 3:
                state[firstIndex - i] = 1;
        }
    }
}




function renderBoard() {
    
}


function renderControls() {

}







function createShips() {
    let newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'ship-holder');
    mainSection.append(newDiv);
    for (let i = 0; i < boardSize; i++) {
        let newNode = document.createElement('div');
        newNode.setAttribute('class', 'node');
        newNode.setAttribute('id', `${char + i}`);
        newDiv.append(newNode);
    }
    return newDiv;
}





function createState(size) {
    let arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(0)
    }
    return arr;
}


// Takes an input (x) and creates a board div with x squared nodes
// it also sets the boardSize var to use in creating the game state
// it gives board class and node class as well as id index with p or c for player or cpu
function createBoard(size) {
    boardSize = size * size;
    rootVars.style.setProperty('--board-size', size);
    let newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'board');
    mainSection.append(newDiv);
    for (let i = 0; i < boardSize; i++) {
        let newNode = document.createElement('div');
        newNode.setAttribute('class', 'node');
        newNode.id = i;
        newDiv.append(newNode);
    }
    return newDiv;
}


// Returns random number between 0 - (num - 1) for random functions
function rng(num) {
    return Math.floor(Math.random() * num);
}

// Clears all elements from the main game area to allow to switch game display
function clearMain() {
    const mainEls = document.querySelectorAll('main > *');
    mainEls.forEach((el) => el.remove());
}