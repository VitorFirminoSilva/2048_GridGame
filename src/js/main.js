import Controller from "./GameController.js";

var startX, startY,finalX, finalY;
var threshold = 300;
var startTime, finalTime;
var allowedTime = 300;
var threshold = 150;
var restraint = 100;

window.onload = () => {
    Controller.setGame();
	setColor();
}

const reset = () => {
    Controller.resetGame();
	setColor();
}

const setColor = () => {
	let r = Math.floor(Math.random() * 255) + 1;
	let g = Math.floor(Math.random() * 255) + 1;
	let b = Math.floor(Math.random() * 255) + 1;
	let grid = document.querySelector('.grid');
	grid.style.setProperty('--color-grid', 'rgb(' + r + ',' + g + ',' + b + ')');
}

const verifyKey = (code) => {
    const codes = ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'];
    return codes.includes(code);
};

const getButons = (button) => {
	
	localStorage.setItem("grid-aux", JSON.stringify(Controller.getGrid()));
		
	if(Controller.isArrowsActive()) Controller.setNewJSONInStorage();
	
    switch(button){
        case 'ArrowLeft': {Controller.slideLeft();}
        break;
        case 'ArrowRight': {Controller.slideRight();}
        break;
        case 'ArrowUp': {Controller.slideUp();}
        break;
        case 'ArrowDown': {Controller.slideDown();}
        break; 
    }
	
	if(!Controller.compareGrids(Controller.getGrid(), JSON.parse(localStorage.getItem("grid-aux")))){
		Controller.setNumberInGrid();
	}
	
    if(Controller.getScore() > Controller.getRecord()) Controller.setRecord(Controller.getScore());
    
    document.getElementById('record').innerText = Controller.getRecord();
    document.getElementById('score').innerText = Controller.getScore();
}


const handlerTouch = () => {
	let distX = finalX - startX;
	let distY = finalY - startY;
	
	let elapsedTime = finalTime - startTime;
	
	if(elapsedTime <= allowedTime){
		if(Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
			(distX < 0) ? getButons('ArrowLeft') : getButons('ArrowRight');
		}
		else if(Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
			(distY < 0) ? getButons('ArrowUp') : getButons('ArrowDown');
		}
	}
}

window.addEventListener('touchstart', (event) => {
	var touchObj = event.changedTouches[0];
	startX = touchObj.pageX;
	startY = touchObj.pageY;
	startTime = new Date().getTime();
});

window.addEventListener('touchend', (event) => {
	var touchObj = event.changedTouches[0];
	finalX = touchObj.pageX;
	finalY = touchObj.pageY;
	finalTime = new Date().getTime();

	handlerTouch();
});

document.addEventListener('keyup', function(e){
	if(!verifyKey(e.code)) return;
	getButons(e.code);
});

const resetBTN = document.getElementById('button-reset');
resetBTN.addEventListener('click', reset);

const leftKey = document.getElementById('button-return-left');
leftKey.addEventListener('click', function (){
	Controller.returnGridWithArrows(-1);
});

const rightKey = document.getElementById('button-return-right');
rightKey.addEventListener('click', function (){
	Controller.returnGridWithArrows(1);
});
