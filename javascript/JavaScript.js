function init()
{
	//clear canvas & set events
	clear();
	canvas.onclick = removeEvent;
	canvas.onmousemove = mouseMove;
	canvas.onmousedown = weaponFire;
	canvas.onmouseup = weaponStopFire;
	canvas.onwheel = weaponSwap;
	document.onkeydown = keyboardDown;
	document.onkeyup = keyboardUp;
	window.onblur = gamePause;
	
	//set image sources
	imgSky.src = "image/sky.jpg"; 				//background
	imgAirplane.src = "image/airplane.png";	 	//airplane
	imgCoin.src = "image/coin.png"; 			//coin
	imgGun.src = "image/bullet.png"; 			//bullet
	imgRocket.src = "image/rocket.png";			//rocket
	imgBomb.src = "image/bomb.png";				//bomb
	imgBoom.src = "image/boom.png"; 			//boom explode
	imgMissile.src ="image/missile.png"; 		//missile
	imgLock.src = "image/lock.png"; 			//locker
	imgCOP.src = "image/poliz.png"; 			//helicopter
	imgShuriken.src = "image/shuriken.png"; 	//shuriken
	imgHarambe.src = "image/harambe.png"; 	//gorilla
	imgBaby.src = "image/baby.png"; 			//baby
	
	//airplane
	airplane = {
		img: imgAirplane,
		direct: [false, false, false],
		r: 100,
		x: W/2.5,
		y: H/2.5,
		dx: 1,
		dy: 1,
		alpha: 0,
		da: 1.5,
		flight: new Array(),
		velocity: 0,
		hp: 5,
		weapons: 1,
		score: 0,
		combo: 0,
	}
	
	//weapons
	weapon = {
		imgBullet: imgGun,
		imgRocket: imgRocket,
		imgBomb: imgBomb,
		imgBomb2: imgBoom,
		imgMissile: imgMissile,
		
		name: ["Gun", "Rifle", "Rocket", "Bomb", "Missile"],
		price: [0, 250, 500, 800, 1200],
		ammoPrice: [0, 50, 100, 200, 400],
		ammoValue: [0, 30, 3, 3, 2],
		writeDelay: 0,
		shootDelay: 0,
		bought: 0,
		
		bullets: new Array(),
		quantity: [1, 0, 0, 0, 0],
		current: 1,
		hold: false,
		superUse: false,
		weaponSpecial: 0,
	}
	
	//coin
	coin = {
		img: imgCoin,
		x: 0,
		y: 0,
		value: 500,
		spawn: true,
		r: 25,
		delta: 25
	}
	
	//enemy
	done = false;
	nextX = (getRandomInt(0,1) == 1 ? 0 : W-80);
	nextY = getRandomInt(50, H*0.85-50);
	
	//timers
	pause = false;
	time = 0;
	mainTimer = setInterval(main, 10);
	copTimer = setInterval(addEnemy, 2000);
}

function main()
{
	if (!document.hidden)
	{
		clear();
		drawImage(imgSky, 0, 0, W, H*0.85);
		airplane.alpha = angleFix(airplane.alpha);
		addBullets();
		moveEnemy();
		//drawing
		dmBullet();
		dmSpecial();
		dmFlight();
		dmEnemyAttack();
		dmCoin();
		rotateImage(airplane.img, airplane.x, airplane.y, airplane.r, airplane.r, airplane.alpha);
		drawStand();
		drawBlocks();
		writeInfo();
		drawBuy();
		dmAim();
		
		//moving
		anglePlayer();
		movePlayer();
		
		//collision
		coinHit(airplane.x, airplane.y, airplane.r, airplane.r, coin.x, coin.y, coin.r, coin.r);
		
		time++;
	}
	//check if player lose
	if(airplane.hp <= 0)
		gameLose();
}