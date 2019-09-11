var Transition = function() {
	
	this.v = false;
	
	// position - start at the bottom
	this.p = Constants.H;
	
	this.speed = 60;
	this.isTop = true;
	
	target = this;
}

Transition.prototype = {
	
	start : function() {
		
		this.p = Constants.H;
		this.v = true;
		this.isTop = true;
	},
	
	onComplete : function() {
		
		this.v = false;
	},
	
	onHidden : function() {
		
		transFunc();
	},
	
	update : function() {
		
		if (this.v) {

			this.p -= this.speed;
			
			if (this.p <= 0 && this.isTop) {
				
				this.onHidden();
				this.isTop = false;
			}
			else if (this.p <= (Constants.H) * -1) {
				
				this.onComplete();
			}

			// clear between
			var px = 0, py = 0;
			if (this.p > 0) py = (this.p) * scale;
			
			ctx.clearRect(px, py, cv.width, (this.p + Constants.H) * scale);
		}
	}
}