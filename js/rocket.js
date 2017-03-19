$(document).ready(function(){
	// canvas build
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var rightKey = false;
	var leftKey = false;
	var bar;
	var barArray = [];
	var initLength = 7;
	var rocketX = 0;
	var barH = 10;
	var barW = 50;
	var barSpace = 50;
	var barStep = 1;
	var rocketStep = 2;
	var scoreText;
	var score = 0;

	var startW = 200;
	var startH = 30
	var isPause = false;
	var isReload = false;

	var myGradient = ctx.createLinearGradient(0,0,0,500);
	myGradient.addColorStop(0,"#1869A0");
	myGradient.addColorStop(1,"#85CDFD");

	function stopGame(){
		if(typeof gameLoop != "undefined") clearInterval(gameLoop);
	}
	function startGame(){
		gameLoop = setInterval(paint, 15);
	}

	function init(){
		initBar();
		stopGame();
		startGame();
		addScore();
		speedUp();
	}
	init();

	
	function initBar(){
		for(var i = 0; i < initLength;i++){
			createBar(i);
		}
	}

	function speedUp(){
		setInterval(function(){
			barStep+=0.5;
		},5000);
	}

	function addScore(){
		scoreLoop = setInterval(function(){
			score++;
		},1000);
	}
	function paintCanvas(){
		ctx.fillStyle= myGradient;
		ctx.fillRect(0,0,w,h);
	}
	function createRocket(x){
		ctx.beginPath();
		ctx.moveTo(150+x,455);
		ctx.lineTo(158+x,465);
		ctx.lineTo(142+x,465);
		ctx.fillStyle = "#F52B29";
		ctx.fill();

		ctx.fillStyle = "#5E5E5E";
		ctx.fillRect(142+x,465,16,20);

		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(150+x,472,3,0,2*Math.PI,true);
		ctx.closePath();
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(142+x,478);
		ctx.lineTo(142+x,488);
		ctx.lineTo(136+x,485);
		ctx.fillStyle = "#5E5E5E";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(158+x,478);
		ctx.lineTo(158+x,488);
		ctx.lineTo(164+x,485);
		ctx.fillStyle = "#5E5E5E";
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(147+x,486);
		ctx.lineTo(153+x,486);
		ctx.lineTo(150+x,493);
		ctx.fillStyle = "#FFC425";
		ctx.fill();

	}
	function moveRocket(){
		if(leftKey){
			if(rocketX >= -134){
				rocketX -= rocketStep;
			}
		}else if(rightKey){
			if(rocketX <= 135){
				rocketX += rocketStep;
			}
		}
	}

	function createBar(i){
		bar = {
			x: Math.random()*(w-barW),
			y: barSpace * i
		}
		barArray.push({x:bar.x,y:bar.y});
	}
	function createTopBar(){
		bar = {
			x: Math.random()*(w-barW),
			y: 0
		}
		barArray.unshift({x:bar.x,y:bar.y});
	}
	function moveBar(){
		if(barArray[0].y >= barSpace){
			createTopBar();
		}
		for(var i=0; i < barArray.length; i++){
			barArray[i].y += barStep;
			paintBar(barArray[i].x,barArray[i].y);
		}
	}
	function paintBar(x,y){
		ctx.fillStyle = "white";
		ctx.fillRect(x,y,barW,barH);
	}

	function paintScore(){
		scoreText = "Score: " + score + "s";
		ctx.fillStyle = "black";
		ctx.fillText(scoreText, 5, h-5);
	}

	function paint(){
		paintCanvas();
		moveBar();
		moveRocket();
		createRocket(rocketX);
		paintScore();
		checkCollision();
	}

	function checkCollision(){
		for(var i = 0; i < barArray.length; i++){
			var x = barArray[i].x;
			var y = barArray[i].y;
			var xw = x + barW;
			var yh = y + barH;
			if(
				150 + rocketX <= x && 158 + rocketX >= x && yh >= 460 && yh <= 465 ||
				158 + rocketX <= x && 164 + rocketX >= x && yh >= 478 && yh <= 485 ||
				142 + rocketX <= xw && 150 + rocketX >= xw && yh >= 460 && yh <= 465 ||
				136 + rocketX <= xw && 142 + rocketX >= xw && yh >= 478 && yh <= 485 ||
				158 + rocketX >= x && 142 + rocketX <= x && yh >= 465 && yh <= 478 ||
				142 + rocketX <= xw && 158 + rocketX >= xw && yh >= 465 && yh <= 478 ||
				142 + rocketX <= xw && 150 + rocketX >= x && yh >= 455 && yh <= 485
				){ 
				punchSound();
				gameOver();
			}
		}

	}

	function gameOver(){
		clearInterval(gameLoop);
		$('#JS_score').text(score);
		$('.dialog').show();
	}

	function punchSound(){
		$("#punch-sound").get(0).play();
	}

	$('.restart-btn').click(function(){
		location.reload();
	})

	// keyboard controls
	$(document).keydown(function(e){
		var key = e.keyCode;
		if (key == 39){
			rightKey = true;
		}else if (key == 37){
			leftKey = true;
		}else if (key == 32){
			isPause = true;
			clearInterval(gameLoop);
			clearInterval(scoreLoop);
		}else if (key == 13){
			if(isPause){
				startGame();
				addScore();
				isPause = false;
			}
		} 
 	})
	$(document).keyup(function(e){
		var key = e.keyCode;
		if (key == 39) rightKey = false;
		else if (key == 37) leftKey = false;
	})

})