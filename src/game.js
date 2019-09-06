var Game = function() {
	
	this.isRun = true;

	this.isCharge = false;
	this.pow = 0;

	this.score = 0;
	
	this.p = null;
	
	// center of tower
	this.cx = 240;
	this.cy = -144;

	this.co = 0;

	// tower info
	this.rad = 120;
	this.circ = Math.PI * this.rad * 2;
	this.ang = 0;
		
	// tower elements
	this.lev = [];
	this.walls = [];		
	this.plats = [];

	this.layouts = [[[1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0], 
					 [1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
					 [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1], 
					 [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], 
					 [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1]],
					 
					[[1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0], 
					 [1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1],
					 [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1], 
					 [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], 
					 [1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1]]];

	this.nextLayout = 0;
	this.currLev = 0;

	// player speed
	this.speed = 0.01;

	var ang = Math.PI / 8;

	this.trees = [new Tree(50, 32), new Tree(150, 48), new Tree(280, 64), new Tree(400, 32), new Tree(550, 64)];
	this.beams = [new Beam(100, -100, 40, ang), new Beam(150, -100, 60, ang), new Beam(170, -120, 100, ang), new Beam(250, -100, 60, ang), new Beam(350, -80, 100, ang), new Beam(390, -120, 60, ang), new Beam(500, -80, 100, ang)];

	this.hud = new HUD();
	this.lf = new ParticleSystem();

	this.music = new Music();
	
	target = this;
}

Game.prototype = {
	
	init : function() {
		
		this.score = 0;
		this.hud.setScore(this.score);

		// leaves
		this.lf.init(images["a/leaf.png"], 15, 100, 0, -2);
		this.lf.setSpawnArea(50, 0);
		this.lf.setForces(0, 0.2);
		this.lf.setSpeedRandomness(2, 2);
		this.lf.setScaling(0.98);

		this.buildLevel();
	},
	
	pausePressed : function() {
	
		if (this.isRun) this.pause();
		else this.resume();
	},
	
	pause : function() {
	
		//this.hud.pause();
		this.isRun = false;
	},
	
	resume : function() {
	
		//this.hud.resume();
		this.isRun = true;
	},
	
	onKeyDown : function(key) {
		
		if (key == 1) {
			
			this.onMouseDown();
		}
	},
	
	onKeyUp : function(key) {
		
		if (key == 1) {
			
			this.onMouseUp();
		}
	},
	
	onMouseDown : function(player) {
		
		if (this.isRun) {
			
			// check buttons first
			if (this.hud.btn.isOver) {
				
				return;
			}
			
			if (this.p.isAlive/* && !this.p.isJump*/) {
			
				//this.p.jump();
				this.isCharge = true;
			}
			
			this.hud.showHelp1 = false;
		}
	},
	
	onMouseUp : function(player) {
		
		if (this.isRun) {
			
			// check buttons first
			if (this.hud.btn.isOver) {
				
				this.hud.click(mousePosition.x, mousePosition.y);
				return;
			}
			
			if (this.p.isAlive) {
				
				this.isCharge = false;
				this.p.jump(this.pow);
				this.pow = 0;
				this.hud.barScale = 0;
			}
		}
	},

	buildLevel :function() {

		var map = [];
		var i;
		// KEY:
		// 1 - block
		// 2 - start
		// 3 - tunnel
		// 4 - branch

		// height
		for (i = 0; i < 18; i += 3) {

			map[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	
			map[i + 1] = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
			map[i + 2] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];			
		}

		// build level
		for (i = 0; i < map.length; i++) {
			
			this.addLevel(i, map);
		}
	},

	addLevel : function(i, map) {

		for (var j = 0; j < 16; j++) {
			
			var a = ((Math.PI * 2) / 16) * j;
			
			var shade = false;

			if (i > 1) {
				
				if (map[i][j] == 1 || map[i][j] == 3) {

					shade = true;
				}
			}

			var w = new Wall(shade);
			this.walls.push(w);
			
			w.a = a;
			w.d = this.cy + Math.cos(a) * this.rad;
			w.x = this.cx + Math.sin(a) * (this.rad);
			w.y = this.cy - (48 * i);
			w.by = 48 * (i + 2);

			if (map[i][j] == 1 || map[i][j] == 3) {
				
				var p = new Platform("a/platform.png");
				this.lev.push(p);
				this.plats.push(p);
				
				p.a = a;

				if (map[i][j] == 3) {

					p.type = 'tunnel';
				}
				else {

					p.type = 'basic';
				}

				p.setScale(1 + (Math.random() * 0.5));
				p.d = (this.cy + Math.cos(a) * (this.rad + 64));
				p.x = this.cx + Math.sin(a) * (this.rad + 64);
				p.y = this.cy - (48 * (i + 1));
				p.by = (48 * (i + 1));

				p.wall = w;
			}
			/*
			else if (map[i][j] == 4) {
				
				var p = new Platform("a/branch.png");
				this.lev.push(p);
				this.plats.push(p);
				
				p.a = a;
				p.type = 'branch';
				p.setScale(1);
				p.d = (this.cy + Math.cos(a) * (this.rad + 24));
				p.x = this.cx + Math.sin(a) * (this.rad + 24);
				p.y = this.cy - (48 * (i + 1));
				p.by = (48 * (i + 1));
			}
			*/
		}

		// create the player at a set position
		this.p = new Player();
		this.p.setScale(1, 1);
		this.p.x = 240;
		this.p.y = 530;

		this.p.isAlive = true;
	},	

	updateLevel : function() {
		
		for (var i = 0; i < this.lev.length; i++) {
		
			var offset = 64;

			if (this.lev[i].type == 'branch') {

				offset = 24;
			}

			this.lev[i].a += this.speed;
			this.lev[i].d = (Math.cos(this.lev[i].a) * (this.rad + offset)) + this.lev[i].y;
			this.lev[i].x = this.cx + Math.sin(this.lev[i].a) * (this.rad + offset);
			
			// back platforms aren't collidable
			if ((Math.cos(this.lev[i].a) * (this.rad + offset)) > 0) {
				
				this.lev[i].isOff = true;
			}
			else {
				
				this.lev[i].isOff = false;
			}
		}
		
		for (var j = 0; j < this.walls.length; j++) {
			
			this.walls[j].a += this.speed;
			this.walls[j].d = (Math.cos(this.walls[j].a) * (this.rad)) + this.walls[j].y;
			this.walls[j].x = this.cx + Math.sin(this.walls[j].a) * (this.rad);
		
			this.walls[j].setScale((Math.cos(this.walls[j].a) * (this.rad)) / (this.rad));

			if ((Math.cos(this.walls[j].a) * (this.rad)) < 0) {
				
				this.walls[j].isFront = true;
			}
			else {

				this.walls[j].isFront = false;
			}			
		}
	},

	drawLevel : function() {
			
		var sprites = [];			
		var i;

		for (i = 0; i < this.lev.length; i++) {
			
			sprites.push(this.lev[i]);
		}
		
		for (i = 0; i < this.walls.length; i++) {
			
			sprites.push(this.walls[i]);
		}
		
		// start sort
		sprites.sort(function(a, b) {
			
			return a.d - b.d;
		});
		
		i = sprites.length - 1;

		while (--i > 0) {
			
			sprites[i].draw();
		}
	},
	
	drawImage : function(img, x, y, w, h) {
		
		var width = w || img.width;
		var height = h || img.height;
		
		ctx.drawImage(img, x * scale, y * scale, ~~(width * scale) + 0.5, ~~(height * scale) + 0.5);
	},

	checkFall : function(p) {
			
		var pMid = this.p.x;
		var pBase = this.p.y + this.p.h;
		
		// check if falling
		if (!this.colPointPlatform(pMid, pBase + 1, p) || !p.isUsed || p.isOff) {
			
			return true;
		}
		
		this.p.currPlatform = p;
		return false;
	},
	
	colPointPlatform : function(px, py, p) {
		
		if (!p.v) return false;
		
		var pLeft = p.x - (p.w / 2);
		var pRight = p.x + (p.w / 2);
		
		// horizontally aligned?
		if (px > pLeft && px < pRight) {
			
			// hitting vertically
			if (py > p.y && py < p.y + p.h) {
				
				return true;
			}
		}
		
		return false;
	},

	draw : function() {


	},

	update : function(mx, my) {

		this.drawImage(images["a/sky.png"], 0, 0, 480);

		var i;

		for (i = 0; i < this.trees.length; i++) {

			this.trees[i].x += this.speed * 100;

			if (this.trees[i].x > 750) this.trees[i].x -= (750 + this.trees[i].w); 
			this.trees[i].draw();
		}

		this.hud.update(mx, my);
		
		//if (this.isRun) {
			
			if (this.isCharge) {

				this.pow += 0.02

				if (this.pow > 1) {

					this.pow = 0;
				}

				this.hud.barScale = this.pow;
			}
			
			if (this.p.isJump) {
			
				// going up and more than halfway up the screen - move the level 
				if (this.p.dy < 0 && this.p.y <= (Constants.HEIGHT / 2)) {
					
					this.cy -= this.p.dy;
					this.co -=  this.p.dy;
				}
				// going down or lower than halfway up the screen - move the player
				else {

					this.p.y += this.p.dy;
				}

				this.p.dy += 0.5;
				
				// cap falling speed
				if (this.p.dy > 16) this.p.dy = 16;
			}

			for (i = 0; i < this.lev.length; i++) {
				
				this.lev[i].y = this.lev[i].by + this.cy;
			}
			
			for (i = 0; i < this.walls.length; i++) {
				
				this.walls[i].y = this.walls[i].by + this.cy;			
			}

			var pMid = this.p.x;
			var pBase = this.p.y;
			
			// no collision detection while in tunnel
			if (!this.p.isTunnel) {
			
				if (this.p.isJump) {
					
					// landed on a platform?				
					for (i = 0; i < this.plats.length; i++) {
						
						if (this.plats[i].v && !this.p.isFall && !this.plats[i].isOff && this.plats[i].isUsed) {
							
							// falling?
							if (this.p.dy > 0) {
								
								var pLeft = this.plats[i].x - (this.plats[i].w / 2);
								var pRight = this.plats[i].x + (this.plats[i].w / 2);
								
								// player midpoint is within the platform dimensions horizontally?
								if (pMid > pLeft && pMid < pRight) {
									
									// vertically colliding
									if (pBase > this.plats[i].y && pBase < this.plats[i].y + this.plats[i].h) {
										
										// was above the platform last update?
										if (pBase - this.p.dy < this.plats[i].y) {

											var diff = this.p.y - this.plats[i].y;

											// going up and more than halfway up the screen - move the level 
											if (this.p.dy < 0 && this.p.y <= (Constants.HEIGHT / 2)) {
												
												this.cy += diff;
												this.co += diff;
											}
											// going down or lower than halfway up the screen - move the player
											else {

												this.p.y -= diff;
											}

											this.p.land();
											//this.lf.burst(5);
											break;
										}
									}
								}

								// gameover when off the bottom of the screen
								if (this.p.y > Constants.HEIGHT) {

									if (this.p.isAlive) {
									
										this.p.isAlive = false;
										this.music.stop();
										quitGame();
									}
								}
							}
						}
					}
				}
				else {
					
					// not already falling?
					if (this.p.dy == 0) {
							
						// falling off a platform?
						for (i = 0; i < this.plats.length; i++) {
						
							if (this.checkFall(this.plats[i])) {
								
								// start falling
								this.p.isJump = true;
							}
							else {
								
								// not falling
								this.p.isJump = false;
								break;
							}
						}
					}
				}
			}

			for (i = 0; i < this.walls.length; i++) {
			
				if (this.walls[i].y > Constants.HEIGHT) {

					this.walls[i].by -= 864;
					this.walls[i].init(false);
				}
			}
			

			for (i = 0; i < this.lev.length; i++) {
			
				if (this.lev[i].y > Constants.HEIGHT) {

					var row = this.lev[i].by;
					
					var layout = this.layouts[this.currLev][this.nextLayout];
					var pos = 0;
					
					for (var j = 0; j < this.lev.length; j++) {

						// all pieces on the same row
						if (this.lev[j].by == row) { 
						
							this.lev[j].by -= 864;
							this.lev[j].y = this.cy + this.lev[j].by;
							this.lev[j].isUsed = false;

							if (layout[pos] == 1) {

								this.lev[j].isUsed = true;
								this.lev[j].setScale(1 + (Math.random() * 0.5));

								// set shadow on the wall
								this.lev[j].wall.init(true);
							}

							pos++;
						}
					}

					this.nextLayout++;
					if (this.nextLayout > 4) {

						this.nextLayout = 0;
					}
				}
			}


			// drop platform when being stood on
			for (i = 0; i < this.plats.length; i++) {

				if (this.plats[i] == this.p.currPlatform) {

					this.plats[i].drop = 0;
				}
				else {

					this.plats[i].drop = -4;
				}
			}


			this.updateLevel();
			this.drawLevel();
			
			this.p.update();
			this.p.draw();

			this.lf.x = this.p.x;
			this.lf.y = this.p.y;
			this.lf.update();
			this.lf.draw();

			for (i = 0; i < this.beams.length; i++) {

				this.beams[i].x -= this.speed * 100;

				if (this.beams[i].x < -200) this.beams[i].x += 750; 

				this.beams[i].draw();
			}

			
			// score goes up every level climbed
			while (this.co > 48) {

				this.score++;
				this.hud.setScore(this.score);

				this.co -= 48;
			}

			if (this.score > hiscore) {
				
				hiscore = this.score;
			}
			
			this.hud.draw();
		//}
	},
	
	cleanUp : function() {
		
		
	}
}