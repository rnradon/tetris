var game = (function(){
var set = true;
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
// context.fillStyle = "#FFFFFF";
// context.fill();
context.scale(20, 20);


function arenaSweep() {
	let rowCount = 1;
	outer: for (let y = arena.length -1; y > 0; --y) {
		for (let x = 0; x < arena[y].length; ++x) {
			if (arena[y][x] === 0) {
				continue outer;
			}
		}

		const row = arena.splice(y, 1)[0].fill(0);
		arena.unshift(row);
		++y;

		player.score += rowCount * 10;
		rowCount *= 2;
	}
}

function collide(arena, player) {
	const m = player.matrix;
	const o = player.pos;
	for (let y = 0; y < m.length; ++y) {
		for (let x = 0; x < m[y].length; ++x) {
			if (m[y][x] !== 0 &&
			   (arena[y + o.y] &&
				arena[y + o.y][x + o.x]) !== 0) {
				return true;
			}
		}
	}
	return false;
}

function createMatrix(w, h) {
	const matrix = [];
	while (h--) {
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

function createPiece(type)
{
	if (type === 'I') {
		return [
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
		];
	} else if (type === 'L') {
		return [
			[0, 2, 0],
			[0, 2, 0],
			[0, 2, 2],
		];
	} else if (type === 'J') {
		return [
			[0, 3, 0],
			[0, 3, 0],
			[3, 3, 0],
		];
	} else if (type === 'O') {
		return [
			[4, 4],
			[4, 4],
		];
	} else if (type === 'Z') {
		return [
			[5, 5, 0],
			[0, 5, 5],
			[0, 0, 0],
		];
	} else if (type === 'S') {
		return [
			[0, 6, 6],
			[6, 6, 0],
			[0, 0, 0],
		];
	} else if (type === 'T') {
		return [
			[0, 7, 0],
			[7, 7, 7],
			[0, 0, 0],
		];
	}
}

function drawMatrix(matrix, offset) {
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				context.fillStyle = colors[value];
				context.fillRect(x + offset.x,
								 y + offset.y,
								 1, 1);
			}
		});
	});
}

function draw() {
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);

	drawMatrix(arena, {x: 0, y: 0});
	drawMatrix(player.matrix, player.pos);
}

// copy all the values from player to arena
function merge(arena, player) {
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				arena[y + player.pos.y][x + player.pos.x] = value;
			}
		});
	});
}

function rotate(matrix, dir) {
	for (let y = 0; y < matrix.length; ++y) {
		for (let x = 0; x < y; ++x) {
			[
				matrix[x][y],
				matrix[y][x],
			] = [
				matrix[y][x],
				matrix[x][y],
			];
		}
	}

	if (dir > 0) {
		matrix.forEach(row => row.reverse());
	} else {
		matrix.reverse();
	}
}

function playerDrop() {
	player.pos.y++;
	if (collide(arena, player)) {
		player.pos.y--;
		merge(arena, player);
		playerReset();
		arenaSweep();
		updateScore();
	}
	dropCounter = 0;
}

function playerMove(offset) {
	player.pos.x += offset;
	if (collide(arena, player)) {
		player.pos.x -= offset;
	}
}

function playerReset() {
	const pieces = 'TJLOSZI';
	player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
	player.pos.y = 0;
	player.pos.x = (arena[0].length / 2 | 0) -
				   (player.matrix[0].length / 2 | 0);
	if (collide(arena, player)) {
		//console.log("GAME OVER")
		document.getElementById("game-over").style.display = "block";
		set = false;
		arena.forEach(row => row.fill(0));
		player.score = 0;
		updateScore();
	}
}

function playerRotate(dir) {
	const pos = player.pos.x;
	let offset = 1;
	rotate(player.matrix, dir);
	while (collide(arena, player)) {
		player.pos.x += offset;
		offset = -(offset + (offset > 0 ? 1 : -1));
		if (offset > player.matrix[0].length) {
			rotate(player.matrix, -dir);
			player.pos.x = pos;
			return;
		}
	}
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
	if(set){
		const deltaTime = time - lastTime;

		dropCounter += deltaTime;
		if (dropCounter > dropInterval) {
			playerDrop();
		}

		lastTime = time;

		draw();
		requestAnimationFrame(update);
	}
}

var first_time = true;	

function updateHighScore(){
	if(first_time){
		if(isNaN(localStorage.getItem("high_score")) || typeof localStorage.getItem("high_score") == 'undefined'|| localStorage.getItem("high_score") == null){
			player.high_score = 0;
			localStorage.setItem("high_score",""+0);
		}
		else{
			player.high_score = parseInt(localStorage.getItem("high_score"));
		}
		first_time = false;
	}
}																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																													

function updateScore() {

		player.high_score = parseInt(localStorage.getItem("high_score"));
		if(player.score > player.high_score){
			player.high_score = player.score;
			localStorage.setItem("high_score",""+player.high_score);
			}
		document.getElementById("high_score").innerHTML = player.high_score;
		document.getElementById('score').innerText = player.score;

}																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																													





const colors = [
	null,
	'#FF0D72',
	'#0DC2FF',
	'#0DFF72',
	'#F538FF',
	'#FF8E0D',
	'#FFE138',
	'#3877FF',
];

const arena = createMatrix(12, 20);

const player = {
	pos: {x: 0, y: 0},
	matrix: null,
	score: 0,
};

return{
	init:function(){

		alert("'q' & 'w' to rotate the blocks. Left, Right and Down Arrow for movement. ENJOY!")
		document.getElementById("play_again").style.display = "block";
		document.getElementById("play_button").style.display = "none";


		//STOP DROPPING OF SHAPES IN ARENA WHEN GAME OVER
		set = true;
		document.getElementById("game-over").style.display = "none";
		console.log(set)

		document.addEventListener('keydown', event => {
			event.preventDefault();
			if (event.keyCode === 37) {
				var left = -1
				playerMove(left);
			} else if (event.keyCode === 39) {
				console.log(event.keyCode)
				var right = 1
				playerMove(right);
			} else if (event.keyCode === 40) {
				playerDrop();
			} else if (event.keyCode === 81) {
				console.log(event.keyCode)
				var q = -1
				playerRotate(q);
			} else if (event.keyCode === 87) {
				var w = 1
				playerRotate(w);
			}
		});

		
		updateHighScore();
		updateScore();
		if(!set){
			console.log("WORKING");
		}
		if(set){
			playerReset();
			update();
			console.log("SET === TRUE")
		}

		//RESET
		// var play_button_click = document.getElementById("play_button");
  //       play_button_click.addEventListener("click", playerReset());
	}
}


})();