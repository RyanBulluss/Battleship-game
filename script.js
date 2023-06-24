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
    cruiser: 3,
    submarine: 3,
    destroyer: 2
}

// Ships in an array to make looping over them easier
const shipsArray = [ships.carrier, ships.battleship, ships.cruiser, ships.submarine, ships.destroyer];


// Variables

let userSizeChoice = 7; //over 10 breaks game
let boardSize = 49;
let playerBoard;
let cpuBoard;
let playerState;
let cpuState;
let PlayersTurn = true;


// Event Listeners



init();

// Must be below init otherwise board does not exist

cpuBoard.addEventListener('click', playerFire);

function init() {
    playerBoard = createBoard('player', userSizeChoice);
    cpuBoard = createBoard('cpu', userSizeChoice);
    playerState = createState(userSizeChoice);
    cpuState = createState(userSizeChoice);
    setShipPositions(playerState);
    setShipPositions(cpuState);
    // randomShips(playerState, shipsArray);
    // randomShips(cpuState, shipsArray);  
    render();
}


function render() {
    renderBoard();
}
















// Creates and returns a 2D array based on the size passed in. All positions are given value 0
function createState(size) {
    let arr = [];
    for (let i = 0; i < size; i++) {
        let arr2 = [];
        for (let j = 0; j < size; j++) {
            arr2.push(0);
        }
        arr.push(arr2);
    }
    return arr;
}

// Takes an input (x) and creates a board div with x squared nodes
// it also sets the boardSize var to use in creating the game state
// it gives board class and node class as well as id index with p or c for player or cpu
function createBoard(playerName, size) {
    boardSize = size * size;
    rootVars.style.setProperty('--board-size', size);
    let newDiv = document.createElement('div');
    newDiv.setAttribute('id', `${playerName}-board`)
    newDiv.setAttribute('class', `board`);
    mainSection.append(newDiv);
    for (let i = 0; i < userSizeChoice; i++) {
        for (let j = 0; j < userSizeChoice; j++) {
            let newNode = document.createElement('div');
            newNode.setAttribute('class', 'node');
            newNode.id = `${i}${j}`;
            newDiv.append(newNode);
        }
    }
    return newDiv;
}

// On clicking the cpu board. Chesks for valid click and turns 0 to 2 or 1 to 3 
function playerFire(evt) {
    if (evt.target.className === 'board') return;
    let node = evt.target.id;
    let yx = node.split('')
    let statePosition = cpuState[yx[0]][yx[1]];

    // if (statePosition !== 0 || statePosition !== 1) return;
    if (statePosition === 0) {
        cpuState[yx[0]][yx[1]] = 2; //miss
    } else if (statePosition === 1) {
        cpuState[yx[0]][yx[1]] = 3; //hit
    }
    // checkWin();
    cpuFire();
}

// 
function cpuFire() {
    let approved = false;
    while(!approved) {
        let x = rng(userSizeChoice);
        let y = rng(userSizeChoice);
        let target = playerState[y][x];
        if (target === 2 || target === 3) continue;
        playerState[y][x] = target ? 3 : 2 ;
        approved = true;
    }
    // checkWin();
    render();
}

// Match the Dom board to the game state ship positions
function renderOneBoard(board, state) {
    const boardArr = Array.from(board.children);
    boardArr.forEach(node => {
        let idx = node.id.split('');
        let target = state[idx[0]][idx[1]]
        switch (target){
            case 0:
                node.className = 'node';
            break;
            case 1:
                node.className = 'ship';
            break;
            case 2:
                node.className = 'miss';
            break;
            case 3:
                node.className = 'hit';
            break;
        }
    });
}

// Renders Player Board and Cpu Board to display the current state
function renderBoard() {
    renderOneBoard(playerBoard, playerState);
    renderOneBoard(cpuBoard, cpuState);
} 

// Takes a game state and a ship to put on that game state. Changes the values in the positions to 1
// Does not touch DOM, that is done in render functions
function randomShip(state, shipSize) {
    // Valid is set to false to continue while loop until all conditions are met
    let valid = false;
    while (!valid) {
        // New random coordinates and direction on every loop (try)
        let x = rng(state.length);
        let y = rng(state.length);
        let isVertical = rng(2) === 1

        //array to track the ship positions with a loop to push them in
        let shipPositions = []
        for (let i = 0; i < shipSize; i++) {
            if (isVertical) {
                shipPositions.push([y + i, x])
            } else {
                shipPositions.push([y, x + i])
            }
        }

        // Valid check is true if all positions are within state length and position is empty (0)
        let validCheck = shipPositions.every(([x, y]) => {
            return (
            x >= 0 &&
            x < state[0].length &&
            y >= 0 &&
            y < state.length &&
            state[y][x] === 0
            );
        });
        
        // if valid check was false retry loop
        if (!validCheck) continue;


        // Set the valid checked ship positions onto the game state. Valid = true to end loop
        shipPositions.forEach(([x, y]) => {
            state[y][x] = 1;
        })
        valid = true;
    }
}

// Loops through shipsArray to add each ship to the state
function setShipPositions(state) {
    shipsArray.forEach(length => {
        randomShip(state, length)
    })
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

