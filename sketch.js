// this is for your game web toy
var testblock;
// player sprite
var player;
// movement boolenas
var isGrounded = true;
// hitbox for portal gun aim
var portalGunAim;
// stage blocks
var walls;
var floor;
var movingPlatform;
var portalAirs;
// portal sprites
var bluePortal;
var orangePortal;
// portal activity booleans
var bluePortalActive;
var orangePortalActive;
// gamestate
var isPlaying;
var gameOverText;
// sounds
var deathSound = new Audio('assets/deathSound.mp3');
var bumpSound = new Audio('assets/bumpSound.mp3');
var teleportSound = new Audio('assets/teleportSound.mp3');
var portalCreationSound = new Audio('assets/portalCreationSound.mp3');
var jumpSound = new Audio('assets/jumpSound.mp3');

function setup() {
    // game initialization
    new Canvas(600, 600);
    isPlaying = true;
    isGrounded = false;

    // player initialization
    player = new Sprite(20, 20);
    player.pos = {x: width/2, y:height/2};
    player.scale = 0.35;
    player.h = 60;
    player.w = 60;
    player.collider='dynamic';
    player.layer=3;
    player.img = 'assets/playerSprite.png';

    // blue portal initialization
    bluePortal = new Sprite()
    bluePortal.w=50;
    bluePortal.h=50;
    bluePortal.layer= 2;
    bluePortal.color = 'blue';
    bluePortal.immovable = 'true';
    bluePortal.overlaps(player);
    bluePortal.visible = false;
    bluePortal.scale = 0.2
    bluePortal.img = 'assets/bluePortalSprite.png';

    // orange portal initialization
    orangePortal = new Sprite()
    orangePortal.w=50;
    orangePortal.h=50;
    orangePortal.layer= 2;
    orangePortal.color = 'orange';
    orangePortal.immovable = 'true';
    orangePortal.overlaps(player);
    orangePortal.visible = false;
    orangePortal.scale = 0.20;
    orangePortal.img = 'assets/orangePortalSprite.png';

    // portal gun aim initialaztion
    portalGunAim = new Sprite(1, 1);
    portalGunAim.visible = false;
    portalGunAim.overlaps(player);
    portalGunAim.w = 1;
    portalGunAim.h = 1;

    // world physics intialization
    world.gravity.y=100;
    
    // portal activity initialization
    bluePortalActive = false;
    orangePortalActive=false;

    // stage block initialization
    walls = new Group();
	walls.w = 60;
	walls.h = 30;
	walls.tile = '=';
    walls.color = 'grey';
    walls.collider = 'static;'

    floor = new Group();
	floor.w = 60;
	floor.h = 30;
	floor.tile = '-';
    floor.color = 'grey';
    floor.collider = 'static;'

    lava = new Group();
	lava.w = 60;
	lava.h = 30;
	lava.tile = '!';
    lava.color = 'red';
    lava.collider = 'static;'
    
    movingPlatform = new Group();
    movingPlatform.collider = 'kinematic';
    movingPlatform.w = 120;
    movingPlatform.h = 30;
    movingPlatform.color = 'gray';
    movingPlatform.tile='_';
    movingPlatformSequence();

    portalAir = new Group();
    portalAir.w = 60;
    portalAir.h = 30;
    portalAir.layer = 1;
    portalAir.tile='p';
    portalAir.color = 'purple';
    portalAir.immovable='true';
    portalAir.overlaps(player);
    
    // stage setup
	new Tiles(
		[
			'=====================================================',
            '=.....................................=.............=',
            '=...................pp................=.............=',
            '=.....................................=.............=',
            '=.....................................=.............=',
            '=...................---------------...=ppp..........=',
            '=.................................=...=.............=',
            '=.................................=...=.............=',
            '=.................................=...=.............=',
            '=.................................=...=.............=',
            '=.................................=...=.............=',
            '=.................................=ppp=.............=',
            '=..............ppp................=...=.............=',
            '=.....=.......=...................=...=.............=',
            '=.....=.......=...................=...=.............=',
            '=.....=.......=.........-.........=...=.............=',
            '=.....=.......=........-..........=...=.............=',
            '=p....=.ppp...=..._...-.....ppp...=!!!=.............=',
            '---------------!!!!!--------------------------------=',



		],
		100,
		40,
		walls.w + 0,
		walls.h + 0
	);
    }

function draw() {
	clear();
    background(0);
    portal();

    // restart game
    if(kb.pressed("r")){

        window.location.reload();
    }
    
    // game over detection
    if(player.collide(lava)){
        gameOver();
    }

    // player movement
    if(isPlaying){
        playerMovement();
    }

    // teleportation
    if (player.overlapping(bluePortal)) {
        if(orangePortalActive = true){
        
        if(kb.pressed("t")){
            orangePortalTeleport();
        }
    }
}
    if (player.overlapping(orangePortal)) {
        if(bluePortalActive = true){
        if(kb.pressed("t")){
        bluePortalTeleport();
        }
    }
}
    // camera scroll
	camera.x = player.x;
}

// moving block sequence function
async function movingPlatformSequence() {
	await movingPlatform.move(110);
	await movingPlatform.move(-110);
	movingPlatformSequence();
}
    
// player movement function
function playerMovement() {
	if (kb.pressing("right")) {
		player.vel.x = 5;
	}
	if (kb.pressing("left")) {
		player.vel.x = -5;
    }
    if (kb.pressing("up"))    {
        if(isGrounded){
        player.vel.y = -20;
        jumpSound.play();
        isGrounded = false;
        }
    }
    // jump check
    if (player.colliding(floor)|| (player.colliding(movingPlatform))){
        isGrounded = true;
        }
    else if (player.colliding(walls)){
        bumpSound.play();
    }
}

// create portal function
function portal() {
// portal gun aim position
portalGunAim.x = mouse.x;
portalGunAim.y = mouse.y;
// blue portal creation
    if (portalGunAim.overlapping(portalAir)) {
       if(kb.pressed("q")){
        if(bluePortalActive == 'true')  {
        bluePortal.remove();
        createBluePortal();
        }
        else {
        createBluePortal();
        }
    }
    // orange portal creation
    if(kb.pressed("e")){
        if(orangePortalActive == 'true')  {
            orangePortal.remove();
            createOrangePortal();
            }
            else {
            createOrangePortal();
            }
            }
        }
       }
    
// function to create blue portal
function createBluePortal(){
    bluePortal.x = mouse.x;
    bluePortal.y = mouse.y;
    portalCreationSound.play();
    bluePortal.visible = true;
    
}
// function to create orange portal
function createOrangePortal(){
            orangePortal.x = mouse.x;
            orangePortal.y=mouse.y;
            portalCreationSound.play();
            orangePortal.visible = true;
}

// teleport functions
function orangePortalTeleport(){
    player.x = orangePortal.x;
    player.y = orangePortal.y;
    teleportSound.play();
    isGrounded = false;
}
function bluePortalTeleport(){
    player.x = bluePortal.x;
    player.y = bluePortal.y;
    teleportSound.play();
    isGrounded = false; 
}

// game over function
function gameOver(){
    deathSound.play();
    player.visible = false;
    player.collider = 'static';
    isPlaying = false;
    gameOverText = new Sprite(300, 300);
    gameOverText.w = 600;
    gameOverText.h = 600;
    gameOverText.color = 'black';
    gameOverText.textSize = 30;
    gameOverText.text="Game Over- press R to restart";
    gameOverText.textColor = 'red';
    gameOverText.collider= 'static';
    gameOverText.x = player.x;
}

