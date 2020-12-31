var posX, posY; //mouse position X, mouse position Y

var imgSky = new Image(),		//background
	imgAirplane = new Image(), 	//player
	imgCoin = new Image(),		//coin
	imgGun = new Image(), 		//bullets
	imgRocket = new Image(),	//rocket
	imgBomb = new Image(),		//bomb
	imgBoom = new Image(),		//bomb explode
	imgMissile = new Image(),	//missile
	imgLock = new Image(),		//locked weapon
	imgCOP = new Image(),		//enemy
	imgShuriken = new Image(),	//shuriken
	imgHarambe = new Image(),	//gorilla
	imgBaby = new Image();		//baby

var airplane;			//aiplane object (player)
var weapon;				//weapon object (player)
var coins;				//coin object (all)

var enemy,				//enemy object (COP)
	done,				//enemy is spawned
	nextX, nextY;		//enemy following x, y 
	
var pause;				//is game paused
var time;				//time in 0.01 sec (each 10 miliseconds)
var mainTimer;			//timer for the game
var copTimer;			//timer for enemy spawn
var attackTimer;		//time for enemy attack (shurikens)