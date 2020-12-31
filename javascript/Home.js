function tutorial()
{
	canvas.onmousemove = homeMove;
	canvas.onclick = homeClick;
	writeWord(50, "Algerian", 0.75, 2, "rgb(78, 171, 252)", "black", "Welcome", W*0.33, H*0.08);
	writeWord(40, "Algerian", 0.5, 2, "rgb(22, 57, 153)", "black", "keys: ", W*0.02, H*0.16);
	writeWord(40, "Algerian", 0.5, 2, "rgb(22, 57, 153)", "blue", "move = ", W*0.02, H*0.24);
	writeWord(40, "Algerian", 0.5, 2, "rgb(22, 57, 153)", "blue", "turn left = ", W*0.02, H*0.32);
	writeWord(40, "Algerian", 0.5, 2, "rgb(22, 57, 153)", "blue", "turn right = ", W*0.02, H*0.4);
	writeWord(40, "Algerian", 0.5, 2, "rgb(22, 57, 153)", "blue", "buy weapon = ", W*0.02, H*0.48);
	writeWord(40, "Algerian", 0.5, 2, "rgb(22, 57, 153)", "blue", "buy ammo = ", W*0.02, H*0.56);
	writeWord(40, "Algerian", 0.5, 2, "rgb(22, 57, 153)", "blue", "shoot = ", W*0.02, H*0.64);
	writeWord(40, "Algerian", 0.5, 2, "rgb(22, 57, 153)", "blue", "switch = ", W*0.02, H*0.72);
	writeWord(40, "Algerian", 0.5, 2, "rgb(22, 57, 153)", "blue", "Buy hp = ", W*0.02, H*0.8);
	
	writeWord(40, "Algerian", 0.25, 2, "black", "black", "w", W*0.18, H*0.24);
	writeWord(40, "Algerian", 0.25, 2, "black", "black", "a", W*0.28, H*0.32);
	writeWord(40, "Algerian", 0.5, 2, "black", "black", "s", W*0.31, H*0.4);
	writeWord(40, "Algerian", 0.5, 2, "black", "black", "1 - 5", W*0.33, H*0.48);
	writeWord(40, "Algerian", 0.5, 2, "black", "black", "r click", W*0.28, H*0.56);
	writeWord(40, "Algerian", 0.5, 2, "black", "black", "l click", W*0.2, H*0.64);
	writeWord(40, "Algerian", 0.5, 2, "black", "black", "wheel scroll", W*0.22, H*0.72);
	writeWord(40, "Algerian", 0.5, 2, "black", "black", "c", W*0.22, H*0.8);
	
	drawStart("rgba(49, 188, 47, 0.9)", "rgba(49, 188, 47, 0.9)");
}
function drawStart(color1, color2)
{
	ctx.fillStyle = "white";
	ctx.fillRect(W*0.7, H*0.7, 500, 500);
	
	ctx.lineWidth = 2;
	ctx.fillStyle = color1;
	ctx.strokeStyle = color2;
	ctx.arc(W*0.895, H*0.88, 70, 0, Math.PI*2);
	ctx.fill();
	ctx.stroke();
	writeWord(40, "Algerian", 0.25, 2, "black", "black", "start", W*0.83, H*0.9);
}
function homeMove(event)
{
	posX = event.pageX;
	posY = event.pageY;
	if(mathDist(posX, posY, W*0.895, H*0.88) <= 70)
	{
		drawStart("rgba(93, 234, 91, 0.9)", "rgb(116, 207, 252)");
		canvas.style.cursor = "pointer";
	}
	else
	{
		drawStart("rgba(49, 188, 47, 0.9)", "rgba(49, 188, 47, 0.9)");
		canvas.style.cursor = "";
	}
}
function homeClick()
{
	if(mathDist(posX, posY, W*0.895, H*0.88) <= 70)
		init();
}