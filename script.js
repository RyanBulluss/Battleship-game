// constants
const messageSection = document.querySelector('#message-section');
const mainSection = document.querySelector('main');
const controlsSection = document.querySelector('#controls-section');
const rootVars = document.querySelector(':root');
const startButton = document.getElementById('start-game');
const nameInput = document.querySelector('#name-input');
const sizeSlider = document.querySelector('#board-slider');
const shipSlider = document.querySelector('#ship-slider');
const difficultyOptions = document.querySelectorAll('.difficulty');


// Each ship stored in object to reference the lengths
const ships = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2
}

// Ships in an array to make looping over them easier
let shipsArray = [ships.carrier, ships.battleship, ships.submarine, ships.destroyer];


// Variables
let difficulty;
let username = 'Ryan'; // Default name
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
let cpuLastMove = {
    hit: true,
    position: []
};


// Pressing the start game button stores the user values. Then it clears main and creates ship placement screen 
startButton.addEventListener('click', startGame);
// window.addEventListener('load', createShips);

shipSlider.addEventListener('input', function(e) {
    shipsArray = shipsArray.filter(ship => ship !== 3 && ship !== 2);
    for(let i = 0; i < this.value; i++){
        shipsArray.splice(2, 0, 3);
    }
    shipsArray.push(2);
    document.getElementById('ships-input').innerText = shipsArray.length;
})

sizeSlider.addEventListener('input', function(e) {
    document.getElementById('board-input').innerText = `${this.value} x ${this.value}`;
})










function winnerScreen() {
    clearControls();
    clearMessage();
    createButton('restart');
    document.getElementById('restart-button').addEventListener('click', function() {window.location.reload()})
    if (winner === 'cpu'){
        createMessage('All Your Ships Have Been Sunk. You Lose!');
        mainSection.style.backgroundColor = '#f7979F';
        messageSection.style.backgroundColor = '#f7979F';
        controlsSection.style.backgroundColor = '#f7979F';
    } else {
        createMessage('You Sunk All Their Ships. You Win!');
        mainSection.style.backgroundColor = '#a7f7aF';
        messageSection.style.backgroundColor = '#a7f7aF';
        controlsSection.style.backgroundColor = '#a7f7aF';
    }
}





function regularDifficulty() {
    if (difficulty === 'recruit') return false
    let y = cpuLastMove.position[0];
    let x = cpuLastMove.position[1];

    function checkAdjacent(y, x) {
        if (!validShot(playerState, y, x)) return false;
        let target = playerState[y][x]
        playerState[y][x] = target === 0 ? 3 : 2;
        playerState[y][x] = target === 1 ? 3 : 2;
        cpuLastMove.hit = target === 1 ? true : false;
        cpuLastMove.position = target === 1 ? [y, x] : cpuLastMove.position;
        return true;
    }

    if (checkAdjacent(y + 1, x)) return true;
    if (checkAdjacent(y - 1, x)) return true;
    if (checkAdjacent(y, x + 1)) return true;
    if (checkAdjacent(y, x - 1)) return true;
    return false;
}







function placementCheck(target) {
    let firstIndex = target.id.split('');
    let y = parseInt(firstIndex[0]);
    let x = parseInt(firstIndex[1]);
    let valid = true;
    let shipPositions = []
    for (let i = 0; i < currentShipLength; i++) {
        if (angle === 0) {
            shipPositions.push([y + i, x])
        } else {
            shipPositions.push([y, x + i])
        }
    }

    
    if (!shipPositions.every(([y, x]) => {
        return (
        x >= 0 &&
        x < userSizeChoice &&
        y >= 0 &&
        y < userSizeChoice &&
        playerState[y][x] === 0
        )
    })) valid = false;
    return [shipPositions, valid];
}

function hoverEffect(evt) {
    let target = evt.target;
    if (!currentShip) return;
    if (target.id === 'placement-board') return;
    const checks = placementCheck(target);
    checks[0].forEach(([a, b]) => {
        if (a > playerState.length - 1 || b > playerState[0].length - 1) return;
        document.getElementById(`${a}${b}`).className = checks[1] ? 'valid-position' : 'invalid-position';
    })
}

function unHoverEffect(evt) {
    let target = evt.target;
    if (!currentShip) return;
    if (target.id === 'placement-board') return;
    
    const checks = placementCheck(target);
    checks[0].forEach(([a, b]) => {
        if (a > playerState.length - 1 || b > playerState[0].length - 1) return;
        let node = document.getElementById(`${a}${b}`)
        checkPosition(playerState, a, b, node)
    })
}

// Loops to find a valid position and changes boat to hit or node to miss
// Then checks win and renders state
function cpuFire() {

    let veteran = VeteranDifficulty();
    if (!veteran) {
        let regular = regularDifficulty()
        if (!regular) {
            recruitDifficulty();
        }
    }
    checkWin();
    render();

    if (winner) return winnerScreen();
}

function VeteranDifficulty() {
    if (difficulty === 'recruit' || difficulty === 'regular') return false
    let roll = rng(4) > 2;
    let approved = false;
    if (roll) {
        let remainingShips = [];
        playerState.forEach((arr, colIdx) => {
            arr.forEach((node, rowIdx) => {
                if (node === 1) remainingShips.push([colIdx, rowIdx])
            }
        )})
        let randomNode = remainingShips[rng(remainingShips.length)]
        playerState[randomNode[0]][randomNode[1]] = 3
        console.log([randomNode[0]][randomNode[1]]);
        cpuLastMove.hit = true;
        cpuLastMove.position = [randomNode[0], randomNode[1]];
        approved = true;
    }
    return approved;
}



function recruitDifficulty() {
    let approved = false;
    while(!approved) {
        let x = rng(userSizeChoice);
        let y = rng(userSizeChoice);
        let target = playerState[y][x];
        if (target === 2 || target === 3) continue;
        cpuLastMove.position = target === 1 ? [y, x] : cpuLastMove.position;
        playerState[y][x] = target ? 3 : 2 ;
        approved = true;
    }
}



function getDifficulty() {
    difficultyOptions.forEach(option => {
        if (option.checked) difficulty = option.id;
    })
}

// Starts the main game, adds relevent event listeners, variables, game boards, cpu state etc.
function init() {
    if (document.getElementById('ship-container').innerHTML !== '') return
    clearAll();
    createButton('surrender');
    document.getElementById('surrender-button').addEventListener('click', function() {window.location.reload()});

    playing = true;
    boardSize = userSizeChoice * userSizeChoice;
    playerBoard = createBoard('player', userSizeChoice);
    cpuBoard = createBoard('cpu', userSizeChoice);
    
    cpuState = createState(userSizeChoice);
    setShipPositions(cpuState);
 
    cpuBoard.addEventListener('click', playerFire);
    render();
}

// Renders the state of game to the DOM
function render() {
    renderBoard();
    renderMessage();
}

function renderMessage() {
    clearMessage();
    if (PlayersTurn) {createMessage('Take Your Shot')}
    else createMessage('Computers Shot');
}

// selects the clicked ship and gets the length ready to be added 
function selectShip(evt) {
    let ship = evt.target;
    if (ship.id === 'ship-container') return; 
    document.querySelectorAll('.selected-ship').forEach(boat => {
        boat.className = 'placement-ship';
    })
    ship.className = 'selected-ship';
    let split = ship.id.split('-');
    currentShipLength = split[1]; 
    currentShip = ship;
} 

// After clicking a node check if valid and then the current ship in the current angle
// Then remove the ship div and reset the current ship length 
function placeBattleship(evt) {
    let target = evt.target
    if (target.className !== 'node' && target.className !== 'valid-position') return
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
    currentShip.remove();
    currentShipLength = 0;
    renderOneBoard(placementBoard, playerState);


}

// Helps to create all buttons without repeated code
function createButton(name) {
    let newButton = document.createElement('button');
    newButton.id = `${name}-button`;
    newButton.innerText = name.toUpperCase();
    controlsSection.append(newButton);
}

// Helps to create messages without repeated code
function createMessage(message) {
    let newMessage = document.createElement('h2');
    newMessage.innerText = message;
    messageSection.append(newMessage);
}

// Create a board, create ships, create buttons and init player game state to place ships into
function createShipMenu() {
    placementBoard = createBoard('placement', userSizeChoice);
    createShips();
    createButton('back');
    createButton('rotate');
    createButton('continue');
    document.getElementById('back-button').addEventListener('click', function() {window.location.reload()})
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

// Creates a Ship container, and adds the selected amount of ships to it
function createShips(){
    let newDiv = document.createElement('div');
    newDiv.id = 'ship-container';
    mainSection.append(newDiv);
    shipsArray.forEach(length => {
        let newShip = document.createElement('div');
        newShip.id = `ship-${length}`;
        newShip.className = 'placement-ship';
        newDiv.append(newShip);
    })
}

// Pressing the start game button stores the user values. Then it clears main and creates ship placement screen 
function startGame() {
    userSizeChoice = sizeSlider.value;
    getDifficulty();
    clearAll();
    createShipMenu();
    createMessage('Place Your Ships');
    document.getElementById('placement-board').addEventListener('mouseover', hoverEffect);
    document.getElementById('placement-board').addEventListener('mouseout', unHoverEffect);
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
function createBoard(playerName, size) {
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
    render();
    if (winner) return winnerScreen();
    cpuFire();

}

// Match the Dom board to the game state ship positions
function renderOneBoard(board, state) {

    const boardArr = Array.from(board.children);
    boardArr.forEach(node => {
        let idx = node.id.split('');
        checkPosition(state, idx[0], idx[1], node);
    });
}

function checkPosition(state, a, b, node) {
    let target = state[a][b]
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

function validShot(state, y, x) {
    let check = false;
    if (x >= 0 &&
        x < state[0].length &&
        y >= 0 &&
        y < state.length) {
    node = state[y][x];
    if (node === 0 || node === 1) {
        check = true} else check = false;
    }
    return check;
}

function shoot(target) {
    return target = target ? 3 : 2;
}

// Clears all elements from the main game area to allow to switch game display
function clearMain() {
    document.querySelectorAll('main > *').forEach((el) => el.remove());

}

// Clears all elements from controls section
function clearControls() {
    document.querySelectorAll('#controls-section > *').forEach(el => el.remove());
}

// Clears all elements from message section
function clearMessage() {
    document.querySelectorAll('#message-section > *').forEach(el => el.remove());
}

// Calls clear main, clear contols and clear message 
function clearAll() {
    clearMessage();
    clearMain();
    clearControls();
}