Collisions = {
	
	circle : function(ax, ay, ar, bx, by, br) {
		
		var dif = new Vector2D(bx - ax, by - ay);
		
		if (dif.magnitude() <= ar + br) return true;
		else return false;
	}
}