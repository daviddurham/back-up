var ParticleSystem = function() {
	
	this.x = this.y = 0;
	this.v = true;
	
	this.isRun = this.isPause = false;
	
	this.p = [];
	this.count = 0;
	
	// life span and life randomness
	this.ls = this.lr = 0;
	
	// basic speed
	this.dx = this.dy = 0;
	
	// random speed element
	this.dxR = this.dyR = 0;
	
	this.scaling = 1;
	
	// gravity etc
	this.fX = this.fY = 0;
	
	// spawn interval
	this.spI = 1;

	// next spawn at
	this.spN = 0;
	
	// spawn area
	this.spW = this.spH = 0;
	
	// frame offset allows us to start a particle system a number
	// of frames in (so we don't have to wait for a stream to get going)
	this.fo = 0;
	
	// for set duration bursts
	this.dur = 0;
	
	// will complete / is complete
	this.wc = this.ic = false;
}

ParticleSystem.prototype = {
	
	init : function(asset, n, life, dx, dy) {
		
		this.count = n;
		this.ls = life;
		
		this.dx = dx;
		this.dy = dy;
		
		// create all particles
		var i = this.count;
		while (i-- > 0) {
			
			// create particle and put in list
			var p = new Particle(asset);
			this.p.push(p);
		}
	},
	
	start : function(d) {
		
		this.dur = d || 0;
		this.isRun = true;
		
		if (this.dur > 0) this.wc = true;
		else this.wc = false;
		
		this.ic = false;
		
		// do any frame offsetting
		var i = this.fo;
		
		while (i-- > 0) {
			
			this.update();
		}
	},
	
	stop : function() {
		
		this.isRun = false;
	},
	
	pause : function() {
		
		this.isPause = true;
	}, 
	
	resume : function() {
		
		this.isPause = false;
	},
	
	burst : function(num) {
		
		if (!this.paused) {
			
			var i = num;
			
			while (i-- > 0) {
				
				this.addParticle(this.randomSpeed(this.dx, this.dxR), this.randomSpeed(this.dy, this.dyR), this.randomLife(this.ls));
			}
		}
		
		this.wc = true;
		this.ic = false;
	},
	
	addParticle : function (dx, dy, life) {
		
			// find next free particle
			var i = this.count;
			while (i-- > 0) {
				
				var p = this.p[i];
				
				// unused particles are hidden
				if (!p.v) {
					
					// break loop when free particle is found
					break;
				}
			}
			
			// set start position
			p.x = this.x;
			p.y = this.y;
			
			if (this.spW != 0) {
				
				p.x += (Math.random() * this.spW) - (this.spW * 0.5);
			}
			
			if (this.spH != 0) {
				
				p.y += (Math.random() * this.spH) - (this.spH * 0.5);
			}
			
			p.setScale(1);
			
			p.maxLife = life;
			p.life = life;
			p.fade = 1 / life;
			
			p.dx = dx;
			p.dy = dy;
			
			p.scaling = this.scaling;
			
			// show particle
			p.v = true;
	},
	
	randomSpeed : function(d, r) {
		
		// deviation can be positive or negative
		var r = (((d + 1) * r) * Math.random()) - (((d + 1) * r) * 0.5);
		d += r;
		
		return d;
	},
	
	randomLife : function(life) {
		
		// deviation may ONLY be negative (so we always know the maximum value)
		var r = ((life + 1) * this.lr) * Math.random();
		life -= r;
		
		return life;
	},
	
	setForces : function(fx, fy) {
		
		this.fX = fx || 0;
		this.fY = fy || 0;
	},
	
	setScaling : function(scale) {
		
		this.scaling = scale;
	},
	
	setlrness : function(random) {
		
		this.lr = random;
	},
	
	setSpeed : function(x, y) {
		
		this.dx = x;
		this.dy = y;
	},
	
	setSpeedRandomness : function(x, y) {
		
		this.dxR = x;
		this.dyR = y;
	},
	
	setSpawnArea : function(x, y) {
		
		this.spW = x;
		this.spH = y;
	},

	setSpawnInterval : function(interval) {
		
		this.spI = interval;
	},
	
	setFrameOffset : function(offset) {
		
		this.fo = offset;
	},
	
	update : function() {
		
		if (this.isPause) return;
		
		if (this.dur > 0) {
		
			if (--this.dur == 0) this.stop();
		}
		
		if (this.isRun && !this.isPause) {
			
			if (this.spN >= this.spI) {
				
				// add a particle every frame while the system is running
				this.addParticle(this.randomSpeed(this.dx, this.dxR), this.randomSpeed(this.dy, this.dyR), this.randomLife(this.ls));
				this.spN = 0;
			}
			
			this.spN++;
		}
		
		var i = this.count;
		
		while (i-- > 0) {
			
			var p = this.p[i];
			
			if (p.v) {
				
				// reduce life
				p.life--;
				
				if (p.life <= 0) {
					
					// remove the particle when dead
					p.v = false;
				}
				else {
					
					// is there any gravity/forces
					p.dy += this.fY;
					p.dx += this.fX;
					
					// update position
					p.x += p.dx;						
					p.y += p.dy;
					
					// update size
					p.setScale(p.scale * p.scaling);
				}
			}
		}
		
		// check for completion
		if (this.wc && !this.ic) {
			
			var complete = true;
			i = this.count;
			
			while (i-- > 0) {
				
				// all particles hidden
				if (this.p[i].v) {
					
					complete = false;
					break;
				}
			}
			
			if (complete) {
				
				this.ic = true;
			}
		}
	},
	
	draw : function () {
		
		var i = this.count;
		
		while (i-- > 0) {
			
			this.p[i].draw();
		}
	},
	
	cleanUp : function() {
		
		this.p = null;
	},
	
	reset : function() {
		
		var i = this.count;
		
		while (i-- > 0) {
			
			this.p[i].v = false;
		}
	}
}