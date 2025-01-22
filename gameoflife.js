let rows = 40;
let cols = 40;

let playing = false;

let timer;
let reproductionTime = 300;

let grid = [];
let nextGrid = [];

let generation = 0;

let cellSize = 20;

let liveCellColors = [
    "red",
    "blue",
    "orange",
    "yellow",
    "purple",
    "green",
];

let surviveRules = [2, 3];
let birthRules = [3];

document.addEventListener('DOMContentLoaded', () => {
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
    setupForm();
    setupRulesForm()
});

function setupForm() {
    let cellSizeSelect = document.getElementById('cellSize');
    cellSizeSelect.addEventListener('change', (event) => {
        cellSize = parseInt(event.target.value); //parseInt vrací hodnotu v celých číslech
        updateCellSize();
    });
}

function updateCellSize() {
    let table = document.querySelector('table');
    if (table) {
        let cells = table.getElementsByTagName('td');
        for (let cell of cells) {
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
        }
    }
    console.log(`Cell size updated to: ${cellSize}px`);
}

function resetGrids() {
    playing = false;
    clearTimeout(timer);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
    updateView();
    generation = 0;
    updateGenerationLabel();
}

function play() {
    console.log("Play the game");
    computeNextGen();
    generation++;
    updateGenerationLabel();
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function updateGenerationLabel() {
    let generationLabel = document.getElementById('generation');
    generationLabel.textContent = generation;
}

function initializeGrids() {
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols).fill(0);
        nextGrid[i] = new Array(cols).fill(0);
    }
}

function createTable() {
    let gridContainer = document.getElementById("gridContainer");
    if (!gridContainer) {
        console.error("Error: 'gridContainer' div is missing in HTML!");
        return;
    }
    let table = document.createElement("table");

    for (let i = 0; i < rows; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", `${i}_${j}`);
            cell.setAttribute("class", "dead");
            cell.addEventListener("click", cellClickHandler);
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.innerHTML = "";
    gridContainer.appendChild(table);
}

function cellClickHandler() {
    let [row, col] = this.id.split("_").map(Number);
    if (grid[row][col] === 1) {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        this.setAttribute("class", "live");
        grid[row][col] = 1;
    }
}

function setupControlButtons() {
    let startButton = document.getElementById("start");
    let clearButton = document.getElementById("clear");
    let randomButton = document.getElementById("random");

    startButton.addEventListener("click", () => {
        if (playing) {
            playing = false;
            clearTimeout(timer);
            startButton.innerHTML = "Start";
        } else {
            playing = true;
            startButton.innerHTML = "Stop";
            play();
        }
    });

    clearButton.addEventListener("click", () => {
        playing = false;
        clearTimeout(timer);
        document.getElementById("start").innerHTML = "Start";
        resetGrids();
    });

    randomButton.addEventListener("click", () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = Math.random() > 0.5 ? 1 : 0;
            }
        }
        updateView();
    });
}

function computeNextGen() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    copyAndResetGrid();
    updateView();
}

function copyAndResetGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function updateView() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.getElementById(`${i}_${j}`);
            if (grid[i][j] === 1) {
                let randomColor = liveCellColors[Math.floor(Math.random() * liveCellColors.length)];
                cell.style.backgroundColor = randomColor;
                cell.classList.remove('dead');
                cell.classList.add('live');
            } else {
                cell.style.backgroundColor = '';
                cell.classList.remove('live');
                cell.classList.add('dead');
            }
        }
    }
}

function applyRules(row, col) {
    let numNeighbors = countNeighbors(row, col);
    if (grid[row][col] === 1) {
        nextGrid[row][col] = surviveRules.includes(numNeighbors) ? 1 : 0;
    } else {
        nextGrid[row][col] = birthRules.includes(numNeighbors) ? 1 : 0;
    }
}

function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            let newRow = row + i;
            let newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                count += grid[newRow][newCol];
            }
        }
    }
    return count;
}

function setupRulesForm() {
     applyRulesButton = document.getElementById('applyRules');

    applyRulesButton.addEventListener('click', () => {
        let surviveInput = document.getElementById('survive').value.trim();
         birthInput = document.getElementById('birth').value.trim();

        surviveRules = surviveInput.split(',').map(Number);
        birthRules = birthInput.split(',').map(Number);

        console.log('Nová pravidla:');
        console.log('Přežití:', surviveRules);
        console.log('Zrození:', birthRules);

        alert('Pravidla byla aktualizována.');
    });
}