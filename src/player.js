var Player = function() {
	
	// position and size
	this.x = this.y = 0;
	this.w = this.h = 0;

	// offset / anchor
	this.ox = this.oy = 0;
	
	// scale
	this.sx = this.sy = 1;
	
	this.img = images["a/p.png"];
	
	this.isAlive = true;
	this.v = true;

	// movement speed
	this.dx = this.dy = 0;

	this.animDir = 1;
	this.hop = 0;
	
	// flag when jumping/falling
	this.isJump = false;
	
	// flag when the player has been hit
	this.isFall = false;

	this.isTunnel = false;
	
	// platform currently on
	this.currPlatform = null;
	
	target = this;
}

Player.prototype = {
	
	init : function() {
		
		
	},
	
	getX : function() {
		
		return this.x + this.ox;
	},
	
	getY : function() {
		
		return this.y + this.oy;
	},
	
	setScale : function(sx, sy) {
		
		this.sx = sx;
		this.sy = sy;
		
		this.w = this.img.width * this.sx;
		this.h = this.img.height * this.sy;

		this.ox = this.w * -0.5;
		this.oy = this.h * -1;
	},
	
	draw : function() {
		
		if (this.v) {
			
			ctx.drawImage(this.img, (this.x + this.ox) * scale, (this.y + this.oy + this.hop) * scale, this.img.width * this.sx * scale, this.img.height * this.sy * scale);
		}
	},

	jump : function(pow) {
			
		if (!this.isJump) {
			
			this.dy = -18 * pow;
			this.isJump = true;
			
			// jump anim
			this.setScale(0.95, 1.1);
			this.hop = 0;

			this.currPlatform = null;
		}
	},
	
	land : function() {
		
		this.isJump = false;
		this.dy = 0;

		this.setScale(1.05, 0.9);
		this.animDir = 1;
		this.hop = 0;
	},

	walkAnim : function() {
			
		if (this.animDir > 0) {
			
			if (this.sy < 1.1) {
				
				this.sy += 0.01;
				this.sx -= 0.005;

				this.hop -= 0.5;
			}
			else {
				
				this.sx = 0.95;
				this.sy = 1.1;
				this.animDir = -1;
			}
		}
		else {
			
			if (this.sy > 0.9) {
				
				this.sy -= 0.01;
				this.sx += 0.005;

				this.hop += 0.5;
			}
			else {
				
				this.sx = 1.05;
				this.sy = 0.9;
				this.animDir = 1;

				this.hop = 0;
			}
		}

		this.setScale(this.sx, this.sy);
	},

	update : function(mx, my) {
		
		// 'walk' animation
		if (!this.isJump) {
			
			this.walkAnim();
		}
	}
}