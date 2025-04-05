import StorageAPI from "../js/api_storage/StorageApi.js";

const gridElement = document.querySelector('.grid');

var record = 0;
var score = 0;
const rows = 4;
const columns = 4;

let grid;

let arrowsActive = false;
let arrowsCount = 0;
let jsonAux = [];

export default class GameController{
	
	static removeElementChilds = (grid) => {
		let child = grid.lastElementChild;
		while (child) {
			grid.removeChild(child);
			child = grid.lastElementChild;
		}
	}
	
	static getScore = () => {
		return score;
	}
	
	static getRecord = () => {
		return record;
	}
	
	static getGrid = () => {
		return grid;
	}
	
	static setRecord = (num) => {
		record = num;
	}
	
	static isArrowsActive = () => {
		return arrowsActive;
	}
	
	static compareGrids = (a, b) => {
	  return JSON.stringify(a) === JSON.stringify(b);
	};
	
	static resetGame = () => {		
		GameController.removeElementChilds(gridElement);
		
		if(score > record) record = score;
		
		score = 0;
		
		GameController.setGame();
	}
	
	static updateTile = (tile, num) => {
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
	
	
	static setGame = () => {
		
		StorageAPI.resetGrid();
		grid = StorageAPI.getNodeGridByID(0);

		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
				let tile = document.createElement('div');
				tile.id = r.toString() + '-' + c.toString();
				let num = grid[r][c];
				GameController.updateTile(tile, num);
				gridElement.append(tile);
			}
		}
		
	}
	
	static setNumberInGrid = () => {
		let [r, c] = StorageAPI.setNumber(grid);
		let tile = document.getElementById(r.toString() + '-' + c.toString());
		let num = grid[r][c];
		GameController.updateTile(tile, num);
		StorageAPI.setNodeGrid(grid);
	}
	
	static filterZero = (row) => {
		return row.filter(num => num != 0);
	}

	static slide = (row) => {
			
		arrowsActive = false;
		arrowsCount = StorageAPI.getLengthJson() - 1;
		
		row = GameController.filterZero(row);

		for (let i = 0; i < row.length; i++) {
			if(row[i] === row[i + 1]){
				row[i] *= 2;
				row[i + 1] = 0;
				score += row[i];
			}        
		}

		row = GameController.filterZero(row);

		while(row.length < columns){
			row.push(0);
		}

		return row;
	}
	
	static slideLeft = () => {
				
		for (let r = 0; r < rows; r++) {
			let row = grid[r];
			row = GameController.slide(row);
			grid[r] = row;

			for (let c = 0; c < columns; c++) {
				let tile = document.getElementById(r.toString() + '-' + c.toString());
				let num = grid[r][c];
				GameController.updateTile(tile, num);
			}
		}		
	}
	
	static slideRight = () => {
				
		for (let r = 0; r < rows; r++) {
			let row = grid[r];
			row.reverse();
			row = GameController.slide(row);
			row.reverse();
			grid[r] = row;

			for (let c = 0; c < columns; c++) {
				let tile = document.getElementById(r.toString() + '-' + c.toString());
				let num = grid[r][c];
				GameController.updateTile(tile, num);
			}
		}
	}
	
	static slideUp = () => {
				
		for (let c = 0; c < columns; c++) {
			let row = [
				grid[0][c],
				grid[1][c],
				grid[2][c],
				grid[3][c]
			]   
			
			row = GameController.slide(row);

			for (let r = 0; r < rows; r++) {
				grid[r][c] = row[r];
				let tile = document.getElementById(r.toString() + '-' + c.toString());
				let num = grid[r][c];
				GameController.updateTile(tile, num);
			}
		}
	}
	
	static slideDown = () => {
    	
		for (let c = 0; c < columns; c++) {
			let row = [
				grid[0][c],
				grid[1][c],
				grid[2][c],
				grid[3][c]
			]   
			row.reverse();
			row = GameController.slide(row);
			row.reverse();

			for (let r = 0; r < rows; r++) {
				grid[r][c] = row[r];
				let tile = document.getElementById(r.toString() + '-' + c.toString());
				let num = grid[r][c];
				GameController.updateTile(tile, num);
			}
		}
	}
	
	static updateGrid = (grid) => {		
		GameController.removeElementChilds(gridElement);
		
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
				let tile = document.createElement('div');
				tile.id = r.toString() + '-' + c.toString();
				let num = grid[r][c];
				GameController.updateTile(tile, num);
				gridElement.append(tile);
			}
		}
		
	}
	
	static returnGridWithArrows = (arrowsChange) => {
		
		if(arrowsChange < -1 || arrowsChange > 1) return;
		if(!arrowsActive){
			arrowsActive = true;
			arrowsCount = StorageAPI.getLengthJson() - 1;
			jsonAux = StorageAPI.read();
		}
		let sum = arrowsCount + arrowsChange;
				
		if(sum >= 0 && sum <= (StorageAPI.getLengthJson() - 1))
		{
			arrowsCount += arrowsChange;
			grid = StorageAPI.getNodeGridByID(arrowsCount);
			GameController.updateGrid(grid);
		}	
	}
	
	static setNewJSONInStorage = () => {
		let jsonTMP = [];
		for (let i = 0; i <= arrowsCount; i++) {
			jsonTMP.push(jsonAux[i]);
		}
		StorageAPI.save(jsonTMP);
	}
	
}