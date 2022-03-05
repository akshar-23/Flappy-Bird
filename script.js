let myGamePiece;
let myBackground;
let myObstacle = [];

let startGame = () => {
	
	myGameArea.start();
	myGamePiece = new component(60,60,"Flappy_Bird_Straight.jpg",400,325,"image");
	myScore = new component("30px","Consolas","black",280,40,"text");
	myBackground = new component2(myGameArea.canvas.width,myGameArea.canvas.height,"Background.jpg",0,0,"image");
	
}

let myGameArea = {

	canvas : document.createElement("canvas"),
	
	start : function() {
		this.canvas.width = 1400;
		this.canvas.height = 650;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0;
		this.interval = setInterval(updateGameArea, 20);

		window.addEventListener('keydown', function(e){
			myGameArea.keys = (myGameArea.keys || []);
			myGameArea.keys[e.keyCode] = true;
			accelerate(-0.8);
 		})

		window.addEventListener('keyup', function(e){
			myGameArea.keys[e.keyCode] = false;
			accelerate(0.5);
		})
	},

	clear : function () {
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	},

	stop : function () {
		clearInterval(this.interval);
	}

}

let everyInterval = (n) => {
	if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
	return false
}

function component(width,height,color,x,y,type) {
	this.type = type;
	if (type == "image"){
		this.image = new Image();
		this.image.src = color;
	}
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.gravity = 0.05;
	this.gravitySpeed = 0;
	this.x = x;
	this.y = y;

	this.update = function(){
		ctx = myGameArea.context;
		if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
		} 

		else if (this.type == "image"){
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		}

		else {
			ctx.fillStyle = color;
			ctx.fillRect(this.x,this.y,this.width,this.height);
		}
		
	}

	this.newPos = function(){
		this.gravitySpeed += this.gravity;
		this.x += this.speedX;
		this.y += this.speedY + this.gravitySpeed;

		if (this.x < (this.width * -1)){
			this.x = myGameArea.canvas.width;
		} else if (this.x > myGameArea.canvas.width){
			this.x = (this.width * -1);
		}

		if (this.y < (this.height * -1)){
			this.y = myGameArea.canvas.height;
		} else if (this.y > myGameArea.canvas.height){
			this.y = (this.height * -1);
		}
		this.hitBottom();
	}

	this.hitBottom = function(){
		let rockBottom = myGameArea.canvas.height - this.height;
		if (this.y > rockBottom) {
			this.y = rockBottom;
		}
	}

	this.crashWith = function(otherobj) {
		let myLeft = this.x;
		let myRight = this.x + this.width;
		let myTop = this.y;
		let myBottom = this.y + this.height;
		let otherLeft = otherobj.x;
		let otherRight = otherobj.x + otherobj.width;
		let otherTop = otherobj.y;
		let otherBottom = otherobj.y + otherobj.height;
		crash = true;
		if ((myBottom < otherTop) || (myTop > otherBottom) || (myLeft > otherRight) || (myRight < otherLeft)) {
			crash = false;
		}
		return crash;
	}
}

let accelerate = (n) => {
	myGamePiece.gravity = n;
}

function component2(width,height,color,x,y,type) {
	this.type = type;
	if (type == "image"){
		this.image = new Image();
		this.image.src = color;
	}
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;

	this.update = function(){
		ctx = myGameArea.context;
		if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
		} 

		else if (this.type == "image"){
			ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		}

		else {
			ctx.fillStyle = color;
			ctx.fillRect(this.x,this.y,this.width,this.height);
		}
		
	}

	this.newPos = function(){
		this.x += this.speedX;
		this.y += this.speedY;

		if (this.x < (this.width * -1)){
			this.x = myGameArea.canvas.width;
		} else if (this.x > myGameArea.canvas.width){
			this.x = (this.width * -1);
		}

		if (this.y < (this.height * -1)){
			this.y = myGameArea.canvas.height;
		} else if (this.y > myGameArea.canvas.height){
			this.y = (this.height * -1);
		}
	}

	this.crashWith = function(otherobj) {
		let myLeft = this.x;
		let myRight = this.x + this.width;
		let myTop = this.y;
		let myBottom = this.y + this.height;
		let otherLeft = otherobj.x;
		let otherRight = otherobj.x + otherobj.width;
		let otherTop = otherobj.y;
		let otherBottom = otherobj.y + otherobj.height;
		crash = true;
		if ((myBottom < otherTop) || (myTop > otherBottom) || (myLeft > otherRight) || (myRight < otherLeft)) {
			crash = false;
		}
		return crash;
	}
}

let scoreCount = () => {
		
		let count = 0;
		
		for (i = 0; i < myObstacle.length ; i+=2){
			if (myGamePiece.x >= myObstacle[i].x) {
				count++;
			}
		}
		
		return count;

	}

let updateGameArea = () => {
	let x, height, gap, maxHeight, minHeight, minGap, maxGap;
	for (i =0; i < myObstacle.length; i += 1) {
		if (myGamePiece.crashWith(myObstacle[i])){
			myGameArea.stop();
			return;
		}
	}
	
	myGameArea.clear();

	myBackground.newPos();
	myBackground.update();
	
	myGameArea.frameNo += 1;
	if (myGameArea.frameNo == 1 || everyInterval(60)) {
		x = myGameArea.canvas.width;
		minHeight = 50;
		maxHeight = 300;
		height = Math.floor(Math.random()*(maxHeight - minHeight + 1) + minHeight);
		minGap = 150;
		maxGap = 400;
		gap = Math.floor(Math.random()*(maxGap - minGap + 1) + minGap);
		myObstacle.push(new component(50, height, "Pipe_Up.png", x, 0,"image"));
		myObstacle.push(new component(50, x-height-gap, "Pipe_Down.png", x, height+gap,"image"));
	}
	for (i = 0; i < myObstacle.length; i += 1) {
		myObstacle[i].x -= 5;
		myObstacle[i].update();
	}

	myGamePiece.speedY = 0;
	myGamePiece.speedX = 0;
	
	if (myGameArea.keys && myGameArea.keys[38]) {
		myGamePiece.speedY = -1; 
	}
	
	myScore.text = "SCORE: " + scoreCount() ;
	myScore.update();

	myGamePiece.newPos();
	myGamePiece.update();

}


