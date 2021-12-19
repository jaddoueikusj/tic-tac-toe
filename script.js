import Board from './classes/board.js';
import Player from './classes/player.js';
import { drawWinningLine, hasClass, addClass } from './helpers.js';

function newGame(depth = -1, startingPlayer = 1) {
	const player = new Player(parseInt(depth));
	const board = new Board(['','','','','','','','','']);
	const boardDIV = document.getElementById("board");
	boardDIV.className = '';
    boardDIV.innerHTML = 
        `<div class="cells-wrap">
            <button class="cell-0"></button>
            <button class="cell-1"></button>
            <button class="cell-2"></button>
            <button class="cell-3"></button>
            <button class="cell-4"></button>
            <button class="cell-5"></button>
            <button class="cell-6"></button>
            <button class="cell-7"></button>
            <button class="cell-8"></button>
        </div>`;
	const htmlCells = [...boardDIV.querySelector('.cells-wrap').children];
	const starting = parseInt(startingPlayer),
		maximizing = starting;
    let playerTurn = starting;
    if(!starting) {
        const centerAndCorners = [0,2,4,6,8];
        const firstChoice = centerAndCorners[Math.floor(Math.random()*centerAndCorners.length)];
        const symbol = !maximizing ? 'x' : 'o';
        board.insert(symbol, firstChoice);
        addClass(htmlCells[firstChoice], symbol);
        playerTurn = 1; //Switch turns
    }

    board.state.forEach((cell, index) => {
        htmlCells[index].addEventListener('click', () => {
            if(hasClass(htmlCells[index], 'x') || hasClass(htmlCells[index], 'o') || board.isTerminal() || !playerTurn) return false;
            const symbol = maximizing ? 'x' : 'o'; //Maximizing player is always 'x'
            board.insert(symbol, index);
            addClass(htmlCells[index], symbol);
            if(board.isTerminal()) {
                drawWinningLine(board.isTerminal());
            }
            playerTurn = 0; //Switch turns
            player.getBestMove(board, !maximizing, best => {
                const symbol = !maximizing ? 'x' : 'o';
                board.insert(symbol, parseInt(best));
                addClass(htmlCells[best], symbol);
                if(board.isTerminal()) {
                    drawWinningLine(board.isTerminal());
                }
                playerTurn = 1; //Switch turns
            });
        }, false);
        if(cell) addClass(htmlCells[index], cell);
    });
}

document.addEventListener("DOMContentLoaded", () => { 
	const depth = -1;
	const startingPlayer = 1;
    newGame(depth, startingPlayer);
	document.getElementById("newGame").addEventListener('click', () => {
		const startingDIV = document.getElementById("starting");
		const starting = startingDIV.options[startingDIV.selectedIndex].value;
		const depthDIV = document.getElementById("depth");
        const depth = depthDIV.options[depthDIV.selectedIndex].value;
		newGame(depth, starting);
	});
});