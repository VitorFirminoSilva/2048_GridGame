var grid;
var score = 0;
const rows = 4;
const columns = 4;

window.onload = () => {
    setGame();
}

const setGame = () => {
    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement('div');
            tile.id = r.toString() + '-' + c.toString();
            let num = grid[r][c];
            updateTile(tile, num);
            document.getElementById('grid').append(tile);
        }
    }

    setNumber();
    setNumber();
}

const hasEmptyTile = () => {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if(grid[r][c] === 0){
                return true;
            }
        }        
    }

    return false;
}

const setNumber = () => {

    if(!hasEmptyTile()){
        return;
    }

    let found = false;

    while(!found){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if(grid[r][c] === 0){
            let digit = (Math.floor(Math.random() + 1) * 2)
            grid[r][c] = digit;
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            tile.innerText = digit.toString();
            tile.classList.add('x' + digit.toString());
            found = true;
        }
    }
}


const updateTile = (tile, num) => {
    tile.innerText = '';
    tile.classList.value = '';
    tile.classList.add('tile');

    if(num > 0){
        tile.innerText = num;
        if(num < 4096){
            tile.classList.add('x' + num.toString());
        }else{
            tile.classList.add('x8192')
        }
    }
}


const filterZero = (row) => {
    return row.filter(num => num != 0);
}

const slide = (row) => {
    row = filterZero(row);


    for (let i = 0; i < row.length; i++) {
        if(row[i] === row[i + 1]){
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }        
    }

    row = filterZero(row);

    while(row.length < columns){
        row.push(0);
    }

    return row;
}

const slideLeft = () => {
    for (let r = 0; r < rows; r++) {
        let row = grid[r];
        row = slide(row);
        grid[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let num = grid[r][c];
            updateTile(tile, num);
        }
    }
}

const slideRight = () => {
    for (let r = 0; r < rows; r++) {
        let row = grid[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        grid[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let num = grid[r][c];
            updateTile(tile, num);
        }
    }
}

const slideUp = () => {
    for (let c = 0; c < columns; c++) {
        let row = [
            grid[0][c],
            grid[1][c],
            grid[2][c],
            grid[3][c]
        ]   
        
        row = slide(row);

        for (let r = 0; r < rows; r++) {
            grid[r][c] = row[r];
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let num = grid[r][c];
            updateTile(tile, num);
        }
    } 
}

const slideDown = () => {
    for (let c = 0; c < columns; c++) {
        let row = [
            grid[0][c],
            grid[1][c],
            grid[2][c],
            grid[3][c]
        ]   
        row.reverse();
        row = slide(row);
        row.reverse();

        for (let r = 0; r < rows; r++) {
            grid[r][c] = row[r];
            let tile = document.getElementById(r.toString() + '-' + c.toString());
            let num = grid[r][c];
            updateTile(tile, num);
        }
    } 
}

const getKey = (e) => {

    switch(e.code){
        case 'ArrowLeft': {slideLeft(); setNumber();}
        break;
        case 'ArrowRight': {slideRight(); setNumber();}
        break;
        case 'ArrowUp': {slideUp(); setNumber();}
        break;
        case 'ArrowDown': {slideDown(); setNumber();}
        break; 
    }

    document.getElementById('score').innerText = score;
}

document.addEventListener('keyup', getKey);