var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, ground_image, invisible_ground;
var girl, girl_running, girl_collided, girlImage,monst, monst_running, monst_attack;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var jumpSound, dieSound, checkpointSound;
var score;
var gameOver, restart, gameOverImage, restartImage;
var heart;

function preload() {
  ground_image = loadImage("spooky2.jpg");
  girl_running = loadAnimation("girl1.png","girl2.png","girl3.png","girl4.png","girl5.png","girl6.png","girl7.png","girl8.png","girl9.png","girl10.png",);
  monst_running = loadAnimation("ms1.png","ms2.png","ms3.png","ms4.png","ms5.png","ms6.png","ms7.png","ms8.png","ms9.png","ms10.png");
  monst_attack = loadAnimation("strike1.png","strike2.png","strike3.png","strike4.png","strike5.png","strike6.png","strike7.png");
  obstacle1 = loadImage("l.png");
  monst_idle = loadImage("Stand.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  gameOverImage = loadImage("gameOver1.png");
  restartImage = loadImage("restart1.png");
  girl_collided = loadImage("Dead (30).png");
  girlImage = loadImage("girl.png");
}

function setup() {
  createCanvas(900, 500);

  ground = createSprite(0, 0, 0, 0);
  ground.shapeColor = "white";
  ground.addImage("ground_image", ground_image);
  ground.scale = 1.4;
  ground.velocityX = -1

  girl = createSprite(300, 500, 600, 10);
  girl.addAnimation("girl_running", girl_running);
  girl.addImage("girl_collided", girl_collided);
  girl.addImage("girlImage", girlImage);
  girl.scale = 0.4;
  // girl.velocityX=2;
  girl.debug = false;
  girl.setCollider("rectangle", 0, 0, girl.width, girl.height)


  monst = createSprite(50, 410, 600, 10);
  monst.addAnimation("monst_running", monst_running);
  monst.addAnimation("monst_attack", monst_attack);
  monst.addImage("monst_idle", monst_idle);
  monst.scale = 0.4;
  monst.debug = false;
  // zombie.velocityY=-13;
  // zombie.velocityX=Math.round(random(1,2));

  invisible_ground = createSprite(50, 500, 600, 60);
  invisible_ground.visible = false;

  gameOver = createSprite(498, 100);
  gameOver.addImage(gameOverImage);

  restart = createSprite(498, 180);
  restart.addImage(restartImage);

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background("black");

  // console.log(girl.y);
  //Gravity
  girl.velocityY = girl.velocityY + 0.8;
  girl.collide(invisible_ground);

  //Gravity
  monst.velocityY = monst.velocityY + 0.8;
  monst.collide(invisible_ground);


  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    //  zombie.y=girl.y;
    score = score + Math.round(getFrameRate() / 60);

    spawnObstacles();
    if (obstaclesGroup.isTouching(monst)) {
      monst.velocityY = -12;
    }
    ground.velocityX = -(4 + 3 * score / 100);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    if ((keyDown("space") && girl.y >= 220)) {
      girl.velocityY = -12;
      jumpSound.play();
    }

    if (girl.isTouching(obstaclesGroup)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    girl.velocityY = 0
    girl.changeImage("girlImage", girlImage);
    monst.changeAnimation("monst_attack", monst_attack);
    monst.x = girl.x;
    if (monst.isTouching(girl)) {
      girl.changeImage("girl_collided", girl_collided);
      monst.changeImage("monst_idle", monst_idle);
    }
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }
  }


  drawSprites();
  fill("yellow");
  textSize(20);
  text("Score: " + score, 100, 50);
}

function reset(){
  gameState=PLAY;
  gameOver.visible = false;
  restart.visible= false;
  girl.changeAnimation("girl_running", girl_running);
  obstaclesGroup.destroyEach();
  score=0;
  monst.x= 50;
}

function spawnObstacles(){
  if (frameCount % 60 === 0){
    var obstacle = createSprite(600,430,10,40);
    obstacle.velocityX= -6;
    
    var rand = Math.round(random(1,6));
    obstacle.addImage(obstacle1);
    obstacle.scale=0.4;
    obstaclesGroup.add(obstacle);
    obstacle.debug = false;
    obstacle.setCollider("circle",0,0,1);

  }
}
