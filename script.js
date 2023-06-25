// constants
const mainSection = document.querySelector('main');
const rootVars = document.querySelector(':root');

const controlsSection = document.querySelector('#controls-section');
const startButton = document.getElementById('start-game');
const nameInput = document.querySelector('#name-input');
const sizeSlider = document.querySelector('#board-slider');
const shipSlider = document.querySelector('#ship-slider');

// Each ship stored in object to reference the lengths
const ships = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2
}

// Ships in an array to make looping over them easier
const shipsArray = [ships.carrier, ships.battleship, ships.submarine, ships.destroyer];


// Variables

let username;
let userSizeChoice; //over 10 breaks game
let boardSize;
let playerBoard;
let cpuBoard;
let playerState;
let cpuState;
let PlayersTurn = true;
let winner;
let playing;
let angle = 0;
let currentShip;
let currentShipLength;
let placementBoard;


// Pressing the start game button stores the user values. Then it clears main and creates ship placement screen 
startButton.addEventListener('click', startGame);





function init() {
    if (document.getElementById('ship-container').innerHTML !== '') return
    clearMain();
    clearControls();

    playing = true;
    boardSize = userSizeChoice * userSizeChoice;
    cpuBoard = createBoard('cpu', userSizeChoice);
    playerBoard = createBoard('player', userSizeChoice);
    
    cpuState = createState(userSizeChoice);
    setShipPositions(cpuState);

    // randomShips(playerState, shipsArray);
    // randomShips(cpuState, shipsArray);  
    cpuBoard.addEventListener('click', playerFire);
    render();
}


function render() {
    renderBoard();
}






// selects the clicked ship and gets the length ready to be added 
function selectShip(evt) {
    let ship = evt.target;
    if (ship.id === 'ship-container') return; 
    let split = ship.id.split('-');
    currentShipLength = split[1]; 
    currentShip = ship;
} 

// After clicking a node check if valid and then the current ship in the current angle
// Then remove the ship div and reset the current ship length 
function placeBattleship(evt) {
    let target = evt.target
    if (target.className !== 'node') return
    let firstIndex = target.id.split('');
    let y = parseInt(firstIndex[0]);
    let x = parseInt(firstIndex[1]);

    let shipPositions = []
    for (let i = 0; i < currentShipLength; i++) {
        if (angle === 0) {
            shipPositions.push([y + i, x])
        } else {
            shipPositions.push([y, x + i])
        }
    }

    // Valid check is true if all positions are within state length and position is empty (0)
    if (!shipPositions.every(([y, x]) => {
        return (
        x >= 0 &&
        x < userSizeChoice &&
        y >= 0 &&
        y < userSizeChoice &&
        playerState[y][x] === 0
        )
    })) return;


    shipPositions.forEach(([a, b]) => {
        playerState[a][b] = 1;
    })
    renderOneBoard(placementBoard, playerState);
    currentShip.remove();
    currentShipLength = 0;

}

// Creates button to contiue from the ship screen to the game screen
function createContinueButton() {
    let newButton = document.createElement('button');
    newButton.id = 'continue-button';
    newButton.innerText = 'Continue';
    controlsSection.append(newButton);
}


// Create a board, create ships, create buttons and init player game state to place ships into
function createShipMenu() {
    placementBoard = createBoard('placement', userSizeChoice);
    createShips();
    createRotateButton();
    createContinueButton();
    document.getElementById('rotate-button').addEventListener('click', rotateShips);
    document.getElementById('placement-board').addEventListener('click', placeBattleship);
    document.getElementById('ship-container').addEventListener('click', selectShip);
    document.getElementById('continue-button').addEventListener('click', init)
    playerState = createState(userSizeChoice);
}

// toggle angle = 90/0 and rotate div to display ships new angle
function rotateShips() {
    let container = document.getElementById('ship-container');
    angle = angle === 0 ? 90 : 0;
    container.style.transform = `rotate(${angle}deg)`;
}

// Creates a button in the controls section for rotating ships
function createRotateButton() {
    let newButton = document.createElement('button');
    newButton.id = 'rotate-button';
    newButton.innerText = 'Rotate Ships'
    controlsSection.append(newButton);
}

// Creates a Ship container, and adds the selected amount of ships to it
function createShips(){
    let newDiv = document.createElement('div');
    newDiv.id = 'ship-container';
    mainSection.prepend(newDiv);
    shipsArray.forEach(length => {
        let newShip = document.createElement('div');
        newShip.id = `ship-${length}`
        newShip.setAttribute('draggable', 'true');
        newDiv.append(newShip);
    })
}

// Pressing the start game button stores the user values. Then it clears main and creates ship placement screen 
function startGame() {
    username = nameInput.value;
    userSizeChoice = sizeSlider.value;
    for (let i = 0; i < shipSlider.value; i++){
    shipsArray.splice(2, 0, 3)
    }
    
    clearMain();
    startButton.remove();
    createShipMenu();
} 

// The player name and state passed in are opposite as it checks the board you are firing at
function checkWin() {
    checkPlayerWin('cpu', playerState);
    checkPlayerWin(username, cpuState);
}

// Checks if enemy array includes a 1 (ship) If no boats left set winner and playing = false
function checkPlayerWin(playerName, state) {
    let checks = []
    state.forEach(arr => {
        let check = arr.includes(1);
        checks.push(check);
        if (check) return;
    })
    if (checks.includes(true)) return;
    winner = playerName;
    playing = false;
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
    if (!playing) return;
    if (evt.target.className === 'board') return;
    let node = evt.target.id;
    let yx = node.split('')
    let statePosition = cpuState[yx[0]][yx[1]];
    if(statePosition === 2 || statePosition === 3) return;
    // if (statePosition !== 0 || statePosition !== 1) return;
    if (statePosition === 0) {
        cpuState[yx[0]][yx[1]] = 2; //miss
    } else if (statePosition === 1) {
        cpuState[yx[0]][yx[1]] = 3; //hit
    }
    checkWin();
    cpuFire();
}

// Loops to find a valid position and changes boat to hit or node to miss
// Then checks win and renders state
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
    checkWin();
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

// Clears all elements from controls section
function clearControls() {
    const buttons = document.querySelectorAll('#controls-section > *');
    buttons.forEach(el => el.remove())
}

