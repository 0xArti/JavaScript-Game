/***********************/
//GAME CONTROL FUNCTIONS
/**********************/
function removeEvent(){ return false; }
function clear(){
	ctx.clearRect(0, 0, W, H);
	canvas.style.cursor = "none";
}
function gameLose(){
	window.onblur = removeEvent;
	clearInterval(mainTimer);
	ctx.beginPath();
		ctx.fillStyle = "rgba(90, 90, 90, 0.8)";
		ctx.fillRect(0, 0, W, H);
	ctx.closePath();
	writeWord(80, "Franklin Gothic Medium", 1, 0, "rgb(100, 10, 0)", "", "YOU LOSE", W*0.3, H*0.45);
	writeWord(60, "Franklin Gothic Medium", 1, 0, "rgb(85, 17, 104)", "", "Score: "+airplane.score, W*0.37, H*0.65);
}
function gamePause(){
	if(!pause)
	{
		pause = true;
		ctx.beginPath();
			ctx.fillStyle = "rgba(70, 70, 70, 0.7)";
			ctx.fillRect(0, 0, W, H);
			ctx.fillStyle = "rgba(20, 20, 20, 0.7)";
			ctx.fillRect(W*0.3, H*0.32, W*0.56, H*0.2);
		ctx.closePath();
		writeWord(72, "Kristen ITC", 1, 0, "orange", "", "Game Paused", W*0.32, H*0.45);
	}
	clearInterval(mainTimer);
}
function gamePlay(){
	pause = false;
	mainTimer = setInterval(main, 10);
}




/**************************/
//AIRPLANE PLAYER FUNCTIONS
/************************/
function addFlight(size){
	var cloud = {
		x: airplane.x+(size/2)-(Math.sin(airplane.alpha*Math.PI/180)*50),
		y: airplane.y+(size/2)+(Math.cos(airplane.alpha*Math.PI/180)*50),
		size: Math.floor(size/10),
	}
	airplane.flight.push(cloud);
}
function dmFlight(){
	for(var i = 0; i < airplane.flight.length; i++)
	{
		var elem = airplane.flight[i];
		if(elem.size <= 0)
			airplane.flight.shift();
		if(airplane.flight.length > 0 && elem.size > 0)
		{
			ctx.beginPath();
				ctx.strokeStyle = "rgba(225, 190, 190, 0.4)";
				ctx.arc(elem.x, elem.y, elem.size, 0, Math.PI*2);
				ctx.stroke();
			ctx.closePath();
			airplane.flight[i].size -= 0.45;
		}
	}
}
function dmAim(){
	var a = -20;
	var b = -20;
	ctx.strokeStyle = "red";
	ctx.lineWidth = 1.5;
	for(var i = 1; i <= 4; i++)
	{
		var n1 = (1%2) + 1;
		var n2 = 1;
		if(n1 == 1)
			n2 = 2;
		ctx.beginPath();
			ctx.moveTo(posX+a/n2, posY+b/n1);
			ctx.lineTo(posX+a, posY+b);
			ctx.lineTo(posX+a/n1, posY+b/n2);
			ctx.stroke();
		ctx.closePath();
		if(i%2 == 1)
			a = -a;
		else
			b = -b;
	}
}

function movePlayer(){
	if(airplane.direct[0])
	{
		airplane.velocity += 0.02;
		if(airplane.velocity > 2)
			airplane.velocity = 2;
	}
	if(!airplane.direct[0])
	{
		airplane.velocity -= 0.02;
		if(airplane.velocity < 0)
			airplane.velocity = 0;
	}
	if(airplane.velocity > 0)
	{
		var alpha = airplane.alpha;
		if(((airplane.x > 0 || alpha <= 180) && (airplane.x+airplane.r < W || alpha >= 180 || alpha == 0)) && //check for x
			((airplane.y > 0 || alpha <= 270 && alpha >= 90) && (airplane.y+airplane.r < H*0.85 || alpha >= 270 || alpha <= 90))) //check for y
			{
				airplane.dx = Math.sin(alpha*Math.PI/180);
				airplane.dy = -Math.cos(alpha*Math.PI/180);
				airplane.y += airplane.dy*airplane.velocity;
				airplane.x += airplane.dx*airplane.velocity;
				addFlight(airplane.r);
			}
		else
			airplane.velocity /= 1.5;
	}
}
function anglePlayer(){
	if(airplane.direct[1] && !airplane.direct[2])
		airplane.alpha -= airplane.da;
	if(airplane.direct[2] && !airplane.direct[1])
		airplane.alpha += airplane.da;
}
function playerKilledEnemy(){
	clearInterval(attackTimer);
	coin.value += 10+(airplane.combo*10);
	airplane.combo++;
	airplane.score++;
	done = false;
	nextX = (getRandomInt(0,1) == 1 ? 0 : W-80);
	nextY = getRandomInt(50, H*0.85-50);
	if(getRandomInt(1,3) == 1)
		enemySpawnGorilla();
	copTimer = setInterval(addEnemy, 2000);
}
function playerResetHP(){
	airplane.hp--;
	airplane.combo = 0;
}
function buyHeart(){
	if(coin.value >= 500 && airplane.hp < 5){
		airplane.hp++;
		coin.value -= 500;
	}
}


/******************/
//WEAPONS FUNCTIONS
/*****************/
function dmBullet(){
	for(var i = 0; i < weapon.bullets.length; i++)
	{
		var elem = weapon.bullets[i];
		rotateImage(weapon.imgBullet, elem.x, elem.y, elem.a, elem.b, elem.angle);
		elem.x += elem.dx;
		elem.y += elem.dy;
		if(overlapArea(elem.x, elem.y, elem.a, elem.b, 0, 0, W, H*0.84) == 0)
			weapon.bullets.splice(i, 1);
	}
}
function dmSpecial(){
	if(weapon.superUse)
	{
		rotateImage(wsp.img, wsp.x, wsp.y, wsp.a, wsp.b, wsp.angle);
		weaponSpecialCalculate();
		wsp.x += wsp.dx;
		wsp.y += wsp.dy;
		if(overlapArea(wsp.x, wsp.y, wsp.a, wsp.b, 0, 0, W, H*0.86) == 0 && wsp.img != weapon.imgMissile)
			weapon.superUse = false;
	}
}

function bulletHit(x1, y1, a1, b1, x2, y2, a2, b2, now, index){
	if(overlapArea(x1, y1, a1, b1, x2, y2, a2, b2) > 0)
	{
		if(now == 4)
			if(wsp.time > 0 ) { return false; }
		if(now <= 2)
		{
			weapon.bullets.splice(index, 1);
			weapon.superUse = false;
		}
		else if(now == 3)
			weapon.superUse = false;
		else if(now == 5)
		{
			wsp.use--;
			if(wsp.use <= 0)
				weapon.superUse = false;
		}
		return true;
	}
	return false;
}
function weaponHit(x, y, a, b){
	if(weapon.bullets.length > 0 || weapon.superUse)
	{
		for(var i = 0; i < weapon.bullets.length; i++)
		{
			var wbi = weapon.bullets[i];
			if(bulletHit(wbi.x, wbi.y, wbi.a, wbi.b, x, y, a, b, weapon.weaponSpecial, i))
				return true;
		}
		if(weapon.superUse && bulletHit(wsp.x, wsp.y, wsp.a, wsp.b, x, y, a, b, weapon.weaponSpecial))
			return true; 
	}
	return false;
}
function weaponSpecialFire(num){
	if(!weapon.superUse)
		num = 0;
	weapon.weaponSpecial = num;
	var mx = airplane.x + (airplane.r / 2.15) + (Math.sin(airplane.alpha * Math.PI / 180) * (airplane.r / 2));
	var my = airplane.y + (airplane.r / 2.15) - (Math.cos(airplane.alpha * Math.PI / 180) * (airplane.r / 2));
	if(num == 3)
	{
		wsp = {
			img: imgRocket,
			x: mx,
			y: my,
			a: 15,
			b: 40,
			angle: airplane.alpha,
			dx: Math.sin(airplane.alpha * Math.PI / 180) * 5,
			dy: -Math.cos(airplane.alpha * Math.PI / 180) * 5,
		}
	}
	if(num == 4)
	{
		var speed = Math.min(Math.abs(mx - posX) + Math.abs(my - posY), 200);
		wsp = {
			img: imgBomb,
			x: mx,
			y: my,
			a: 42,
			b: 35,
			angle: 0,
			dx: (posX - mx) / speed,
			dy: (posY - my) / speed,
			time: 100,
		}
	}
	if(num == 5)
	{
		wsp = {
			img: imgMissile,
			x: mx,
			y: my,
			a: 20,
			b: 65,
			angle: airplane.alpha,
			dx: 0,
			dy: 0,
			target: findAlpha(mx, my, posX, posY),
			use: 3,
		}
	}
}
function createBullet(xPoint, yPoint, width, height, angle, miss){
	var gunBullet = {
		x: xPoint + (airplane.r / 2.1) + (Math.sin(angle * Math.PI / 180) * (airplane.r / 2)),
		y: yPoint + (airplane.r / 2.1) - (Math.cos(angle * Math.PI / 180) * (airplane.r / 2)),
		a: width,
		b: height,
		angle: miss,
		dx: Math.sin(miss * Math.PI / 180) * 4,
		dy: -Math.cos(miss * Math.PI / 180) * 4,
	}
	return gunBullet;
}
function addBullets(){
	if(weapon.hold && weapon.shootDelay == 0)
	{
		if(weapon.current == 1)
		{
			var bul = createBullet(airplane.x, airplane.y, 5, 20, airplane.alpha, airplane.alpha);
			weapon.bullets.push(bul);
			weapon.shootDelay = 40;
		}
		if(weapon.current == 2 && weapon.quantity[weapon.current-1] > 0)
		{
			var angle = airplane.alpha;
			var n = 0;
			var alpha = angle+getRandomInt(-10, 10);
			for(var i = 0; i < 3; i++)
			{
				var bul = createBullet(airplane.x, airplane.y, 5, 20, angle, alpha);
				n++;
				angle += 90*n;
				if(i != 0)
					weapon.bullets.push(bul);
				weapon.shootDelay = 60;
			}
			weapon.quantity[weapon.current-1]--;
		}
	}
	if(weapon.shootDelay > 0)
		weapon.shootDelay--;
}
function weaponSpecialCalculate(){
	if(wsp.img == imgBomb)
	{
		wsp.angle = angleFix(wsp.angle+1.25); //fix angle
		//reduce time and check if bomb exploded
		wsp.time--;
		if(wsp.time == 0)
		{
			wsp.img = imgBoom;
			wsp.x = wsp.x - wsp.a/2;
			wsp.y = wsp.y - wsp.b/2;
			wsp.a = 160;
			wsp.b = 160;
		}
	}
	if(wsp.img == imgBoom)
	{
		//reduce time and check deactivation
		wsp.time--;
		if(wsp.time == -45)
			weapon.superUse = false;
	}
	if(wsp.img == imgMissile)
	{
		//find target (mouse location)
		wsp.target = findAlpha(wsp.x+wsp.a/2, wsp.y+wsp.b/2, posX, posY)
		//calculate best way (left or right)
		var way1 = angleFix(wsp.target-wsp.angle);
		var way2 = angleFix(360-wsp.target+wsp.angle);
		if(way1 > way2 && wsp.angle != wsp.target)
			wsp.angle -= 2;
		if(way1 < way2 && wsp.angle != wsp.target)
			wsp.angle += 2;
		wsp.angle = angleFix(wsp.angle); //fix angle
		//set delta
		wsp.dx = Math.sin(wsp.angle * Math.PI / 180) * 5;
		wsp.dy = -Math.cos(wsp.angle * Math.PI / 180) * 5;
	}
}
function buyWeapon(num){
	var aw = airplane.weapons;
	if(aw == num-1)
	{
		if(coin.value >= weapon.price[aw])
		{
			weapon.writeDelay = 100;
			weapon.bought = 1;
			coin.value -= weapon.price[aw];
			airplane.weapons++;
			weapon.quantity[aw] += weapon.ammoValue[aw];
		}
		else
		{
			weapon.writeDelay = 100;
			weapon.bought = 2;
		}
	}
	else if(num-1 > aw)
	{
		weapon.writeDelay = 100;
		weapon.bought = 4;
	}
	else
	{
		weapon.writeDelay = 100;
		weapon.bought = 5;
	}
}



/***************/
//COIN FUNCTIONS
/**************/
function dmCoin(){
	//spawn coin in new location
	if(coin.spawn)
	{
		coin.x = getRandomInt(25, W-25);
		coin.y = getRandomInt(25, H-H*0.15-25);
		coin.spawn = false;
	}
	drawImage(coin.img, coin.x, coin.y, coin.r, coin.r); //draw the coin
}
function coinHit(x1, y1, a1, b1, x2, y2, a2, b2){
	if(overlapArea(x1, y1, a1-20, b1-20, x2, y2, a2-5, b2-5) > 0 && time%10 == 0)
	{
		coin.value += coin.delta;
		coin.spawn = true;
	}
}



/********************/
//ENEMY COP FUNCTIONS
/*******************/
function addEnemy(){
	if(!done)
	{
		enemy = {
			img: imgCOP,
			x: nextX,
			y: nextY,
			x1: coin.x,
			y1: coin.y,
			a: 80,
			b: 70,
			angle: angleFix(270+findAlpha(nextX, H*0.425, coin.x, coin.y)),
			dx: 0,
			dy: 0,
			attack: (enemy == null ? new Array() : enemy.attack),
			delay: 1800,
		}
		done = true;
		clearInterval(copTimer);
		attackTimer = setInterval(enemyAttack, enemy.delay);
	}
}
function moveEnemy(){
	if(done)
	{
		enemy.x1 = coin.x;
		enemy.y1 = coin.y;
		enemy.angle = angleFix(270+findAlpha(enemy.x, enemy.y, enemy.x1, enemy.y1));
		var speed = ( Math.abs(enemy.x - enemy.x1) + Math.abs(enemy.y - enemy.y1) ) / 2;
		
		if(angleFix(enemy.angle-270) >= 0 && angleFix(enemy.angle-270) <= 180)
			rotateImage(enemy.img, enemy.x, enemy.y, enemy.a, enemy.b, enemy.angle);
		else
			flipImage(enemy.img, enemy.x, enemy.y, enemy.a, enemy.b, enemy.angle);
		
		enemy.dx = (enemy.x1 - enemy.x) / speed;
		enemy.dy = (enemy.y1 - enemy.y) / speed;
		enemy.x += enemy.dx;
		enemy.y += enemy.dy;
		if(overlapArea(enemy.x, enemy.y, enemy.a, enemy.b, enemy.x1, enemy.y1, coin.r, coin.r) && time%20 ==0)
			coin.spawn = true;
		if(weaponHit(enemy.x, enemy.y, enemy.a, enemy.b))
			playerKilledEnemy();
	}
	else if(time%40 < 20)
		writeWord(50, "Kristen ITC", 1, 0, "red", "", "!", nextX+30, nextY+20);
}
function enemyAttack(){
	var speed = (Math.abs(enemy.x-airplane.x) + Math.abs(enemy.y-airplane.y)) / Math.PI;
	var shuriken = {
		img: imgShuriken,
		x: enemy.x,
		y: enemy.y,
		a: 30,
		b: 30,
		angle: enemy.angle,
		dx: (airplane.x - (enemy.x-enemy.a/2)) / speed,
		dy: (airplane.y - (enemy.y-enemy.b/2)) / speed,
		duration: 0,
	}
	if(enemy.attack.length == 0)
		enemy.attack.push(shuriken);
	else if(enemy.attack[enemy.attack.length-1].duration >= enemy.delay)
		enemy.attack.push(shuriken);
}

function dmEnemyAttack(){
	if(enemy != null)
	{
		for(var i = 0; i < enemy.attack.length; i++)
		{
			var elem = enemy.attack[i];
			rotateImage(elem.img, elem.x, elem.y, elem.a, elem.b, elem.angle);
			elem.x += elem.dx;
			elem.y += elem.dy;
			elem.duration += 10;
			if(elem.img == imgHarambe)
			{
				elem.angle = angleFix(elem.angle+5);
				if(overlapArea(elem.x, elem.y, elem.a, elem.b, W/2.25, H/2.25, 240, 240) > 0 || elem.duration >= 300)
				{
					elem.dx = 0;
					elem.dy = 0;
				}
				if(elem.duration >= 500)
				{
					enemyGorillaDeath(i);
					enemy.attack.splice(i, 1);
				}
			}
			enemySpliceAll(elem, i);
		}
	}
}
function enemySpliceAll(elem, i){
	//check if any weapon colliding with any enemy attack
	if(weaponHit(elem.x, elem.y, elem.a, elem.b))
	{
		if(elem.img != imgShuriken)
			playerResetHP();
		if(elem.img == imgHarambe)
			enemyGorillaDeath(i);
		enemy.attack.splice(i, 1);
	}
	//check if any enemy attack get out of the map
	if(overlapArea(elem.x, elem.y, elem.a, elem.b, 0, 0, W, H*0.84) == 0)
		enemy.attack.splice(i, 1);
	//check if airplane player colliding with any enemy attack
	if(overlapArea(elem.x, elem.y, elem.a-5, elem.b-5, airplane.x, airplane.y, airplane.r-25, airplane.r-25) > 0 && time%25 == 0)
	{
		playerResetHP();
		enemy.attack.splice(i, 1);
	}
}
function enemySpawnGorilla(){
	var speed = (Math.abs(enemy.x-enemy.a/2-W/3) + Math.abs(enemy.y-enemy.b/2-H/3)) / (Math.PI*1);
	var harambe = {
		img: imgHarambe,
		x: enemy.x,
		y: enemy.y,
		a: 60,
		b: 60,
		angle: enemy.angle,
		dx: (W/3 - (enemy.x-enemy.a/2)) / speed,
		dy: (H/3 - (enemy.y-enemy.b/2)) / speed,
		duration: 0,
	}
	enemy.attack.push(harambe);
}
function enemyGorillaDeath(i){
	var alpha = enemy.attack[i].angle;
	for(var j = 0; j < 6; j++)
	{
		var baby = {
			img: imgBaby,
			x: enemy.attack[i].x,
			y: enemy.attack[i].y,
			a: 60,
			b: 60,
			angle: alpha,
			dx: Math.sin(alpha * Math.PI / 180) * 2,
			dy: -Math.cos(alpha * Math.PI / 180) * 2,
			duration: 0,
		}
		alpha += 60;
		enemy.attack.push(baby);
	}
}



/******************/
//DRAWING FUNCTIONS
/*****************/
function writeWord(size, font, line, num, fill, stroke, txt, x, y){
	ctx.beginPath();
		ctx.lineWidth = line;
		ctx.font = size + "px " + font;
		if(num == 0 || num == 2)
		{
			ctx.fillStyle = fill;
			ctx.fillText(txt, x, y);
		}
		if(num == 1 || num == 2)
		{
			ctx.strokeStyle = stroke;
			ctx.strokeText(txt, x, y);
		}
	ctx.closePath();
}
function rotateImage(img, x, y, a, b, degrees){
	ctx.save();
	ctx.translate(x+a/2, y+b/2);
	ctx.rotate(degrees*Math.PI/180);
	ctx.drawImage(img, -a/2, -b/2, a, b);
	ctx.restore();
}
function flipImage(img, x, y, a, b, degrees){
	ctx.save();
	ctx.translate(x+a/2, y+b/2);
	ctx.scale(-1, 1);
	ctx.drawImage(img, -a/2, -b/2, a, b);
	ctx.restore();
}
function drawImage(img, x, y, a, b){
	ctx.beginPath();
	ctx.drawImage(img, x, y, a, b);
	ctx.closePath();
}

function drawStand(){
	ctx.beginPath();
	ctx.fillStyle = "rgba(112, 112, 105, 0.5)";
	ctx.fillRect(0, H*0.85, W, H);
	ctx.closePath();
}
function drawBlocks(){
	var dif = 0;
	for(var i = 1; i <= 5; i++)
	{
		var imgBlock = new Image();
		imgBlock.src = "image/weapons/"+i+".png";
		ctx.beginPath();
		if(airplane.weapons < i) //weapon locked
		{
			drawImage(imgBlock, W*0.15+dif, H*0.86, W*0.11, H*0.13);
			ctx.rect(W*0.15+dif, H*0.86, W*0.11, H*0.13);
			ctx.fillStyle = "rgba(94, 94, 94, 0.75)";
			ctx.fill();
			ctx.globalAlpha = 0.5;
			drawImage(imgLock, W*0.16+dif, H*0.88, W*0.09, H*0.1);
			ctx.globalAlpha = 1;
		}
		else //weapon unlocked
		{
			ctx.rect(W*0.15+dif, H*0.86, W*0.11, H*0.13);
			ctx.fillStyle = "rgba(190, 190, 190, 0.85)";
			ctx.fill();
			drawImage(imgBlock, W*0.15+dif, H*0.86, W*0.11, H*0.13);
			if(i != 1)
				writeWord(26, "Cooper Black", 1, 0, "black", "", weapon.quantity[i-1], W*0.155+dif, H*0.98);
			
		}
		//border
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1.5;
		if(weapon.current == i)
		{
			ctx.strokeStyle = "green";
			ctx.lineWidth = 3;
		}
		ctx.rect(W*0.15+dif, H*0.86, W*0.11, H*0.13);
		ctx.stroke();
		ctx.closePath();
		dif += W*0.115;
	}
}
function drawHeart(x, y){
	for(var i = 1; i <= 5; i++)
	{
		ctx.lineWidth = 2;
		ctx.strokeStyle = "rgba(27, 27, 27, 0.5)";
		ctx.fillStyle = "rgba(64, 64, 64, 0.5)";
		if(airplane.hp >= i)
		{
			ctx.strokeStyle = "rgba(27, 27, 27, 1)";
			ctx.fillStyle = "red";
		}
		ctx.beginPath();
			ctx.moveTo(x,y);
			ctx.bezierCurveTo(x,y-15, x-22,y-17, x-22, y);
			ctx.bezierCurveTo(x-22,y+15, x,y+17, x, y+30);
			ctx.bezierCurveTo(x,y+15, x+22,y+17, x+22, y);  
			ctx.bezierCurveTo(x+22,y-15, x,y-17, x, y);
			ctx.fill();
			ctx.stroke();
		ctx.closePath();
		x += W*0.055;
	}
}
function drawBuy(){
	if(weapon.writeDelay > 0)
	{
		if(weapon.bought == 1) //success to buy weapon
			writeWord(26, "Kristen ITC", 1, 0, "blue", "", "You bought "+weapon.name[airplane.weapons-1], W*0.005, H*0.84);
		if(weapon.bought == 2) //fail to buy weapon (not enought coins)
		{
			var msg = weapon.price[airplane.weapons]-coin.value +" coins";
			writeWord(26, "Kristen ITC", 1, 0, "red", "", "You need more "+msg, W*0.005, H*0.84);
		}
		if(weapon.bought == 3) //fail to buy ammo (not enought coins)
			writeWord(26, "Kristen ITC", 1, 0, "red", "", "Not enought coins", W*0.005, H*0.84);
		if(weapon.bought == 4) //fail to skip weapon (all previous should be unlocked)
			writeWord(26, "Kristen ITC", 1, 0, "red", "", "You need to buy previous weapons", W*0.005, H*0.84);
		if(weapon.bought == 5) //buy unlocked weapon
			writeWord(26, "Kristen ITC", 1, 0, "green", "", "You already own this weapon", W*0.005, H*0.84);
		weapon.writeDelay--;
	}
	else
		weapon.bought = 0;
}
function writeInfo(){
	drawHeart(W*0.75, H*0.92);
	writeWord(30, "Cooper Black", 1, 0, "rgb(45, 120, 15)", "", mil_To_Min_Sec(time*10), W*0.005, H*0.04);
	writeWord(26, "Cooper Black", 1, 0, "rgb(91, 33, 122)", "", "score: "+airplane.score, W*0.005, H*0.08);
	writeWord(26, "Cooper Black", 1, 0, "rgb(25, 140, 150)", "", "combo: "+airplane.combo, W*0.005, H*0.84);
	writeWord(33, "Cooper Black", 1, 0, "rgb(233, 237, 9)", "", "Coins", W*0.005, H*0.91);
	writeWord(26, "Cooper Black", 1, 0, "rgb(236, 239, 9)", "", coin.value, W*0.005, H*0.96);
}



/***************/
//MATH FUNCTIONS
/**************/
function mathDist(x1, y1, x2, y2){
	var a = x2 - x1;
	var b = y2 - y1;
	return Math.sqrt(a*a + b*b);
}
function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function angleFix(a){
	if(a > 360)
		a = a - Math.floor(a/360)*360;
	if(a < 0)
		a = a + Math.floor(a/360)*-360;
	return a;
}
function findAlpha(x1, y1, x2, y2){
	var rtd = 180/Math.PI;
	var a = x1-x2;
	var b = y1-y2;
	var r = Math.sqrt(a * a + b * b);
	var cdx = x2-x1;
	var cdy = y1-y2;
	var alpha = Math.atan(cdx / cdy) * rtd;
	
	if(cdy > 0)
		alpha = angleFix(alpha);
	if(cdy < 0)
		alpha = 180 + alpha;

	return Math.floor(alpha);
}
function overlapArea(x1, y1, a1, b1, x2, y2, a2, b2){
	var overX = Math.max(0, Math.min(x1+a1, x2+a2) - Math.max(x1, x2));
	var overY = Math.max(0, Math.min(y1+b1, y2+b2) - Math.max(y1, y2));
	return overX * overY;
}
function collisionCR(x1, y1, a, b, x2, y2, r){
    var distX = Math.abs(x2 - x1);
    var distY = Math.abs(y2 - y1);

    if (distX > (a/2 + r)) { return false; }
    if (distY > (b/2 + r)) { return false; }
    if (distX <= (a/2)) { return true; } 
    if (distY <= (b/2)) { return true; }

    var hypot = Math.pow((distX - a/2), 2) + Math.pow((distY - b/2), 2);
    return (hypot <= (r*r));
}
function mil_To_Min_Sec(mil){
  var min = Math.floor(mil / 60000);
  var sec = ((mil % 60000) / 1000).toFixed(0);
  return min + ":" + (sec < 10 ? '0' : '') + sec;
}



/*****************/
//EVENTS FUNCTIONS
/****************/
function mouseMove(event){
	posX = event.pageX;
	posY = event.pageY;
}
function weaponFire(event){
	if(event.button == 0)
	{
		if(weapon.current <= 2)
			weapon.hold = true;
		else if(weapon.current >= 3 && !weapon.superUse && weapon.quantity[weapon.current-1] > 0)
		{
			weapon.superUse = true;
			weapon.quantity[weapon.current-1]--;
			weaponSpecialFire(weapon.current);
		}
	}
	if(event.button == 2)
	{
		if(coin.value >= weapon.ammoPrice[weapon.current-1])
		{
			weapon.quantity[weapon.current-1] += weapon.ammoValue[weapon.current-1];
			coin.value -= weapon.ammoPrice[weapon.current-1];
		}
		else
		{
			weapon.writeDelay = 100;
			weapon.bought = 3;
		}
	}
}
function weaponStopFire(event){ weapon.hold = false; }
function weaponSwap(event){
	var wheelDelta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)))
	if(wheelDelta == 1 && weapon.current+1 <= airplane.weapons)
			weapon.current++;
	else if(wheelDelta == -1 && weapon.current-1 > 0)
			weapon.current--;
}
function keyboardDown(event){
	if(event.keyCode == 87) // w
		airplane.direct[0] = true;
	if(event.keyCode == 65) // a
		airplane.direct[1] = true;
	if(event.keyCode == 68) // d
		airplane.direct[2] = true;
	if(event.keyCode >= 49 && event.keyCode <= 53)
		buyWeapon(event.keyCode-48);
	if(event.keyCode == 80 && airplane.hp > 0)
	{
		if(!pause)
			gamePause();
		else
			gamePlay();
	}
	if(event.keyCode == 67) // c
		buyHeart();
}
function keyboardUp(event){
	if(event.keyCode == 87) // w
		airplane.direct[0] = false;
	if(event.keyCode == 65) // a
		airplane.direct[1] = false;
	if(event.keyCode == 68) // d
		airplane.direct[2] = false;
}




