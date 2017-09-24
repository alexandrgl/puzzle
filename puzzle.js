'use strict';
window.onload = initPuzzle;
var game;

function initPuzzle() {
	game = new GamePuzzle();
	game.initGame();
}
function GamePuzzle() {
	var emptyCell = document.querySelector("#cell-0");
	var numberOfCells = 16;
	var numberOfCellsInRow = 4;
	var numberOfExchanges = 0;
	var initArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
	//Order of '.block__element' in HTML is important for game logic!
	var cells = document.querySelectorAll('.block__element');
	
	//-------------------GENERAL FUNCTIONS START-------------------
	this.initGame = function() {
		oncklickHandlerOnCells();
		document.querySelector('.block').addEventListener('keydown', keyPressed);
		document.getElementById('button-mix').onclick = mixPuzzle;
		document.getElementById('close-message').onclick = playAgain;
		mixPuzzle();
	};
	function mixPuzzle() {
		//First method
		/*
		var funArray = [moveLeft, moveUp, moveRight, moveDown];
		for(var i = 0; i < 200; i++) {
			funArray[Math.floor(Math.random()*4)]();
		}
		*/
		//Second method
		shuffleArray(initArray);
		console.log(initArray);
		while(!solutionExists(initArray)){
			shuffleArray(initArray);
			console.log(initArray);
		}
		//set order of HTML-elements as in initArray
		for(var i = 0; i < numberOfCells; i++) {
			cells[initArray[i]].style.order = i + 1;
		}
		numberOfExchanges = 0;
		document.getElementById('exchanges').innerHTML = 'Exchanges: 0';
		document.querySelector('.block').focus();
	}
	function shuffleArray(array) {
		for (var i = array.length - 1; i >= 0; i--) {
			var num = Math.floor(Math.random() * (i + 1));
			var d = array[num];
			array[num] = array[i];
			array[i] = d;
		}
	}
	function solutionExists(array) {
		var coeff = 0;
		var indexOfEmptyCell = numberOfCells;
		var endOfArray = array.length; //endOfArray = numberOfCells
		for (var i = 0; i < endOfArray - 1 ; i++) {
			if(array[i] == 0) {indexOfEmptyCell = i + 1; continue;}
			for (var j = (i + 1); j < endOfArray; j++) {
				if(array[j] == 0) {continue;}
				if (array[j] < array[i]) {coeff++;}
			}
		}
		var rowWithEmptyCell = 1;
		while((indexOfEmptyCell - rowWithEmptyCell * numberOfCellsInRow) > 0) {
			rowWithEmptyCell++;
		}
		coeff += rowWithEmptyCell;
		if(coeff % 2){
			console.log(false);
			return false;
		} else {
			console.log(true);
			return true;
		}
	}
	function checked() {
		if(emptyCell.style.order == numberOfCells) {
			var temp;
			for (var i = 1; i < numberOfCells; i++) {
				temp = getCellByOrder(i);
				if(temp.childNodes[0].innerHTML != i){
					return;
				}
			}
		} else {return;}
		puzzleComplete();
	}
	function puzzleComplete() {
		document.getElementById('shadow-window').style.display = 'block';
		var messageWindow = document.getElementById('message-window');
		messageWindow.firstElementChild.innerHTML = 'Puzzle complete!<br>Exchanges: ' + numberOfExchanges;
		messageWindow.style.display = 'block';
		document.querySelector('#close-message').focus();
	}
	function playAgain() {
		document.getElementById('shadow-window').style.display = 'none';
		document.getElementById('message-window').style.display = 'none';
		mixPuzzle();
	}
	//-------------------GENERAL FUNCTIONS END-----------------------

	//-------------------FUNCTIONS FOR EXCHANGE CELLS START-----------
	function exchangeEmptyCellByOrder(order) {
		var newEmptyCell = getCellByOrder(order);
		exchangeEmptyCellWith(newEmptyCell);
		numberOfExchanges++;
		document.getElementById('exchanges').innerHTML = 'Exchanges: ' + numberOfExchanges;
		checked();
	}
	function getCellByOrder(order) {
		var someString = 'div[style*="order: ' + order + ';"]';
		return document.querySelector(someString);
	}
	function exchangeEmptyCellWith(cell) {
		var temp = cell.style.order;
		cell.style.order = emptyCell.style.order;
		emptyCell.style.order = temp;
	}
	//-------------------FUNCTIONS FOR EXCHANGE CELLS END-----------

	//-------------------HANDLERS START-----------------------------
	function oncklickHandlerOnCells() {
		for(var i = 1; i < numberOfCells; i++) {
			cells[i].onclick = function (e) {
				if(emptyCell.style.order == (+this.style.order - numberOfCellsInRow)) {
					moveUp();
				} else if (emptyCell.style.order == (+this.style.order + numberOfCellsInRow)) {
					moveDown();
				} else if (emptyCell.style.order == (+this.style.order + 1)) {
					moveRight();
				} else if (emptyCell.style.order == (+this.style.order - 1)) {
					moveLeft();
				}
			};
		}
	}
	function keyPressed(e) {
		switch(e.keyCode) {
			//left key
			case 37:
				e.preventDefault();
				moveLeft();
				break;
			//up key
			case 38:
				e.preventDefault();
				moveUp();
				break;
			//right key
			case 39:
				e.preventDefault();
				moveRight();
				break;
			//down key
			case 40:
				e.preventDefault();
				moveDown();
			 break;
			default: break;
		}
	}
	//-------------------HANDLERS END-----------------------------

	//-------------------MOVE FUNCTION START--------------------------
	function moveUp() {
		 var newIndexEmptyCell = +emptyCell.style.order + numberOfCellsInRow;
		 if(newIndexEmptyCell <= numberOfCells) {
		 	exchangeEmptyCellByOrder(newIndexEmptyCell);
		 }
	}
	function moveDown() {
			var newIndexEmptyCell = +emptyCell.style.order - numberOfCellsInRow;
			if(newIndexEmptyCell > 0) {
				exchangeEmptyCellByOrder(newIndexEmptyCell);
		 }
	}
	function moveLeft() {
		var newIndexEmptyCell = +emptyCell.style.order + 1;
		if((newIndexEmptyCell % numberOfCellsInRow) != 1) {
			exchangeEmptyCellByOrder(newIndexEmptyCell);
		}
	}
	function moveRight() {
		var newIndexEmptyCell = +emptyCell.style.order - 1;
		if((newIndexEmptyCell % numberOfCellsInRow) != 0) {
			exchangeEmptyCellByOrder(newIndexEmptyCell);
		}
	}
	//-------------------MOVE FUNCTION END-----------------------------
}
