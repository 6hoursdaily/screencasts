function getLighterColor(customColor) {
	var increase = 50;
	var r = customColor.substr(1,2);
	var g = customColor.substr(3,2);
	var b = customColor.substr(5,2);	
	var r_b10 = parseInt(r, 16);
	var g_b10 = parseInt(g, 16);
	var b_b10 = parseInt(b, 16);
	r2_b10 = ((r_b10 + increase) >= 255) ? 255 : (r_b10 + increase);
	g2_b10 = ((g_b10 + increase) >= 255) ? 255 : (g_b10 + increase);
	b2_b10 = ((b_b10 + increase) >= 255) ? 255 : (b_b10 + increase);		
	var lighterCustomColor = '#' + r2_b10.toString(16) + g2_b10.toString(16) + b2_b10.toString(16);	
	return lighterCustomColor;
}