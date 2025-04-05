const rows = 4;
const columns = 4;

export default class StorageAPI{

	static getLengthJson = () => {
		let json = StorageAPI.read();
		return json.length;
	}
	
	static getNodeGridByID = (gridID) => {
		let json = StorageAPI.read();
		return json[gridID];
	}

	static setNodeGrid = (gridCurrent) => {
		let json = StorageAPI.read();
		
		if(json.length >= 10)
		{
			json.shift();
		}
		
		json.push(gridCurrent);
		StorageAPI.save(json);
	}
	
	static resetGrid = () => {
		StorageAPI.save(StorageAPI.setInitialGrid());
		
		return StorageAPI.read();
	}

	static hasEmptyTile = (gridAux) => {
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
				if(gridAux[r][c] === 0){
					return true;
				}
			}        
		}

		return false;
	}

	static setNumber = (gridAux) => {

		if(!StorageAPI.hasEmptyTile(gridAux)){
			return;
		}

		let found = false;
		let r;
		let c;

		while(!found){
			r = Math.floor(Math.random() * rows);
			c = Math.floor(Math.random() * columns);

			if(gridAux[r][c] === 0){
				let digit = (Math.floor(Math.random() + 1) * 2)
				gridAux[r][c] = digit;
				found = true;
			}
		}
		return new Array(r,c);
	}
	
	static setInitialGrid = () => {
		let grid = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
		
		StorageAPI.setNumber(grid);
		StorageAPI.setNumber(grid);
		
		let json = [];
		json.push(grid);
		return json;
	}
	
	static read(){
		const json = localStorage.getItem("storage-data");

		if(!json){
			return StorageAPI.setInitialGrid();
		}

		return JSON.parse(json);
	}
	
	
	static save(data){
		localStorage.setItem("storage-data", JSON.stringify(data));
	}

}