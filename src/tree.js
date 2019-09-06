var Tree = function(x, w) {
	
	this.x = x;
	this.y = 0;	
	
    this.img = images["a/back_tree.png"];

    // scale
    this.sx = w / this.img.width;
    this.sy = 720;

    // visible
    this.v = true;
}

Tree.prototype = {
	
	draw : function() {
		
		if (this.v) {
		
			ctx.drawImage(this.img, this.x * scale, this.y * scale, this.img.width * this.sx * scale, this.img.height * this.sy * scale);
		}
	}
}