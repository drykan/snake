$(document).ready(function(){

	var canvas = $("#canvas")[0];
	var context = canvas.getContext("2d");
	var canvasWidth = $("#canvas").width();
	var canvasHeight = $("#canvas").height();
	
	var segmentWidth = 10;
	var direction;
	var food;
	var score;
	var snakeArray;

	function init() {
		var chooseDiff = ( "<h3>Choose Difficulty</h3>" );
		var easyGame = ( "<button id='easyGameBtn' type='button'>Easy</button>" );
		var medGame = ( "<button id='medGameBtn' type='button'>Medium</button>" );
		var hardGame = ( "<button id='hardGameBtn' type='button'>Hard</button>" );
		context.fillText(chooseDiff, 20, 300);
		context.fillText(easyGame, 300, 300);
		context.fillText(medGame, 300, 400);
		context.fillText(hardGame, 300, 500);
		start();
	}
	init();


	function start() {
		direction = "right";
		createSnake();
		createFood();
		score = 0;

		var snakeSpeed;

		if ( $( "#hardGameBtn").clicked == true ) {
			snakeSpeed = 30;
		} else if ( $("#medGameBtn").clicked == true ) {
			snakeSpeed = 60;
		} else {
			snakeSpeed = 100;
		}

		if(typeof game_loop != "undefined") clearInterval(game_loop);
			game_loop = setInterval(paintSnake, snakeSpeed);
	}


	function createSnake() {
		var length = 6;
		snakeArray = [];

		for (var i = length-1; i >= 0; i--) {
			snakeArray.push({x: i, y: 0});
		}
	}

	function createFood() {
		food = {
			x: Math.round(Math.random()*(canvasWidth-segmentWidth) / segmentWidth), 
			y: Math.round(Math.random()*(canvasHeight-segmentWidth) / segmentWidth), 
		};
	}

	function paintSnake() {
		context.fillStyle = "slategray";
		context.fillRect(0, 0, canvasWidth, canvasHeight);
		context.strokeStyle = "#708090";
		context.strokeRect(0, 0, canvasWidth, canvasHeight);

		var nx = snakeArray[0].x;
		var ny = snakeArray[0].y;

		if(direction == "right") nx++;
		else if(direction == "left") nx--;
		else if(direction == "up") ny--;
		else if(direction == "down") ny++;
		
		if(nx == -1 || nx == canvasWidth/segmentWidth || ny == -1 || ny == canvasHeight/segmentWidth || check_collision(nx, ny, snakeArray))
		{
			start();
			return;
		}
		
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			createFood();
		}
		else
		{
			var tail = snakeArray.pop();
			tail.x = nx; tail.y = ny;
		}
		
		snakeArray.unshift(tail); 
		
		for(var i = 0; i < snakeArray.length; i++)
		{
			var c = snakeArray[i];
			paint_cell(c.x, c.y);
		}

		paint_cell(food.x, food.y);
		var score_text = "Score: " + score;
		context.fillText(score_text, 5, canvasHeight-5);
	}

	function paint_cell(x, y) {
		context.fillStyle = "#800000";
		context.fillRect(x*segmentWidth, y*segmentWidth, segmentWidth, segmentWidth);
		context.strokeStyle = "slategray";
		context.strokeRect(x*segmentWidth, y*segmentWidth, segmentWidth, segmentWidth);
	}
	
	function check_collision(x, y, array) {
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
	
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "37" && direction != "right") direction = "left";
		else if(key == "38" && direction != "down") direction = "up";
		else if(key == "39" && direction != "left") direction = "right";
		else if(key == "40" && direction != "up") direction = "down";
	})
});