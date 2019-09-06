// all images used
var sources = [	"a/pause_out.png",  
				"a/sky.png",
				"a/title.png",
				"a/up.png",
				"a/font.png",
				"a/bar.png",
				"a/bar_base.png",
			
				"a/p.png",
				"a/leaf.png",
				"a/platform.png",
				"a/branch.png",
				"a/w2.png",
				"a/w3.png",
				"a/ws.png",
			
				"a/back_tree.png",
				"a/ray.png"];

// storage for all images
var images = {};

// counts for preloading
var loadedImages = 0;
var totalImages = 0;

// sections
var preload;
var menu;
var game;

// screen transition
var trans;
var transFunc;

var canvas = null;
var canvasRect = null;
var ctx = null;

var audioCtx = null;

// game state
var state;

// scaling
var scale;
var ratio;

var mousePosition;
var buttons = [];

// ref to this scope level
var target = this;

// run init on load
window.onload = init;
window.addEventListener('resize', resizeCanvas, false);

var hiscore = 0;
var firstPlay1 = true;
var isTouch = false;


/* FPS */

var timeInterval = 0;
var lastTime = 0;
var frame = 0;
var avgFps = 0;

function getFPS() {

	frame++;
	
	var date = new Date();
	var thisTime = date.getTime();
	
	timeInterval = 1000 / (thisTime - lastTime);
	lastTime = thisTime;

	if (frame % 10 == 0) {
		
		avgFps = Math.round(timeInterval * 10) / 10;
	}

	return avgFps.toFixed(0);
}


/* Initialisation */

function init() {
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	if (window.AudioContext) {

		audioCtx = new window.AudioContext();
	}

	state = Constants.STATE_INIT;
	
	canvas = document.getElementById('game');
	canvasRect = canvas.getBoundingClientRect();
	ctx = canvas.getContext('2d');
	//ctx.webkitImageSmoothingEnabled = false;
	
	//ratio = canvas.height / canvas.width;
	ratio = canvas.width / canvas.height;
	
	resizeCanvas();
	
	// create preloader with width and height
	preload = new Preloader(this, 200, 32);
	
	// handle mouse behavior
	mousePosition = {x:0, y:0};
	canvas.addEventListener('mousemove', onMouseMove, false);
	canvas.addEventListener('mousedown', onMouseDown, false);
	canvas.addEventListener('mouseup', onMouseUp, false);

	canvas.addEventListener('touchmove', onTouchMove, false);
	canvas.addEventListener('touchstart', onTouchDown, false);
	canvas.addEventListener('touchend', onTouchUp, false);
	
	canvas.addEventListener('keydown', onKeyDown, false);
	canvas.addEventListener('keyup', onKeyUp, false);
	
	// main update loop
	setInterval(update, 1000 / Constants.FPS);
}

function resizeCanvas() {

	canvas.height = window.innerHeight;
	canvas.width = canvas.height * ratio; 
	
	// set the scale (fixed ratio)
	scale = canvas.width / Constants.WIDTH;
}

function printText(px, py, text, center, s) {
	
	var i = -1;
	var len = text.length;
	var image = images["a/font.png"];
	
	var size = s || 1;

	var offset = 0;
	if (center) offset = (len * 24 * size) * 0.5;
	
	while(i++ < len) {
		
		ctx.drawImage(image, ((text.charCodeAt(i) - 32) % 10) * 32, (Math.floor((text.charCodeAt(i) - 32) / 10) - 1) * 32, 32, 32, ((px - offset) * scale) + (i * 24 * scale * size), py * scale, 32 * size * scale, 32 * size * scale);
	}
}


/* Keyboard */

function onKeyDown(event) {
	
	if (state == Constants.STATE_GAME) {
		
		var key = event.keyCode;
		
		//if (key == 88) {
		
			game.onMouseDown(1);
		//}
	}
}

function onKeyUp(event) {
	
	if (state == Constants.STATE_GAME) {
	
		var key = event.keyCode;
		
		//if (key == 88) {
			
			game.onMouseUp(1);
		//}
	}
}


/* Mouse / Touch Handling */

function onMouseMove(event) {
	
	mousePosition = getMousePosition(canvas, event);
}

function onMouseDown(event) {
	
	if (state == Constants.STATE_GAME) game.onMouseDown(1);
}

function onMouseUp(event) {
	
	if (state == Constants.STATE_MENU) menu.click(mousePosition.x, mousePosition.y);
	else if (state == Constants.STATE_GAME) game.onMouseUp(1);
}

function onTouchMove(event) {
	
	event.preventDefault();
	
	mousePosition = getTouchPosition(canvas, event);
}

function onTouchDown(event) {
	
	event.preventDefault();
	mousePosition = getTouchPosition(canvas, event);
	
	if (state == Constants.STATE_GAME) {
		
		if (mousePosition.x < Constants.WIDTH * 0.5 * scale) game.onMouseDown(1);
		else game.onMouseDown(2);
	}
}

function onTouchUp(event) {
	
	event.preventDefault();
	mousePosition = getTouchPosition(canvas, event);
	
	if (state == Constants.STATE_MENU) {
		
		isTouch = true;
		menu.click(mousePosition.x, mousePosition.y);
	}
	else if (state == Constants.STATE_GAME) {
	
		if (mousePosition.x < Constants.WIDTH * 0.5 * scale) game.onMouseUp(1);
		else game.onMouseUp(2);
	}
}

function getTouchPosition(canvas, event) {
	
	return { x: event.changedTouches[0].pageX - canvas.offsetLeft, y: event.changedTouches[0].pageY - canvas.offsetTop };
}

function getMousePosition(canvas, event) {
	
	return { x: event.pageX - canvas.offsetLeft, y: event.pageY - canvas.offsetTop };
}


/* Simple Image Loading */

function loadAllImages(src) {
	
	// count images
	totalImages = src.length;
	
	// load images
	for (var s in src) {
		
		loadImage(src[s]);
	}
}

function loadImage(src) {

	images[src] = new Image();
	images[src].onload = function() {
	
		loadedImages += 1;
		preload.update(loadedImages, totalImages);
	}
	
	images[src].src = src;
}

function startGame(players) {
	
	numPlayers = players;
	transFunc = onTransitionGame;
	trans.start();
}

function quitGame() {
	
	transFunc = onTransitionQuit;
	trans.start();
}

function onTransitionQuit() {

	game.cleanUp();
	game = null;
	
	menu = new Menu();
	menu.init();			
	
	state = Constants.STATE_MENU;
}

function onTransitionGame() {
	
	game = new Game();
	game.init();
	
	state = Constants.STATE_GAME;
	
	menu.cleanUp();
	menu = null;
}

/* Main Loop */

function update() {
	
	// clear the screen
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	switch (state) {
		
		case Constants.STATE_INIT:
			
			if (preload.isReady) {
				
				loadAllImages(sources);
				state = Constants.STATE_LOAD;
			}
			break;
		
		case Constants.STATE_LOAD:
			
			preload.draw();
			
			if (preload.isComplete) {
				
				menu = new Menu();
				menu.init();
				
				trans = new Transition();
				state = Constants.STATE_MENU;
			}
			break;
			
		case Constants.STATE_MENU:
			
			menu.update(mousePosition.x, mousePosition.y);
			menu.draw();
			break;
		
		case Constants.STATE_GAME:			
			
			game.update(mousePosition.x, mousePosition.y);
			game.draw();
			break;
	}
	
	if (trans) {
	
		trans.update();
		trans.draw();
	}
	
	if (state > Constants.STATE_LOAD) {
		
		printText(240, 16, "BEST " + hiscore, true);
		//printText(10, 10, getFPS() + " FPS", false);
	}
}