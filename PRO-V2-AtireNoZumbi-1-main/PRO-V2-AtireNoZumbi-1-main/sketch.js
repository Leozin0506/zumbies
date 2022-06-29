var bg,bgImg;
var player, shooterImg, shooter_shooting;
var edges;
var heart1, heart2, heart3;
var hearts1,hearts2,hearts3;
var zombie, zombimg;
var zombieGp;
var bullets = 70;
var bulletGp
var estadojogo = "fight";
var pontos = 0;
var vidas = 3;
var loseSound, winSound, shootSound;

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png");
  shooter_shooting = loadImage("assets/shooter_3.png");

  bgImg = loadImage("assets/bg.jpeg");

  heart1 = loadImage("assets/heart_1.png");
  heart2 = loadImage("assets/heart_2.png");
  heart3 = loadImage("assets/heart_3.png");

  zombimg = loadImage("assets/zombie.png");

  shootSound = loadSound("assets/explosion.mp3")
  loseSound = loadSound("assets/lose.mp3")
  winSound = loadSound("assets/win.mp3")
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  bg = createSprite(displayWidth/2-20, displayHeight/2-40, 20, 20);
  bg.addImage(bgImg);
  bg.scale = 1.1;

  player = createSprite(displayWidth-1150, displayHeight-300,50,50);
  player.addImage(shooterImg);
  player.scale = 0.3;
  player.setCollider("rectangle",0,0,300,500);
  player.debug = true;
  
  hearts1 = createSprite(displayWidth-150,40,20,20);
  hearts1.addImage("1heart",heart1);
  hearts1.visible = false;
  hearts1.scale = 0.4;
  hearts2 = createSprite(displayWidth-100,40,20,20);
  hearts2.addImage("2heart",heart2);
  hearts2.visible = false;
  hearts2.scale = 0.4;
  hearts3 = createSprite(displayWidth-150,40,20,20);
  hearts3.addImage("3heart",heart3);
  hearts3.scale = 0.4;

  zombieGp = new Group();
  bulletGp = new Group();

  edges = createEdgeSprites();

}

function draw() {
  background(0); 

  if(estadojogo === "fight"){
    if(vidas === 3){
      hearts1.visible = false
      hearts2.visible = false
      hearts3.visible = true
    }
    if(vidas === 2){
      hearts1.visible = false
      hearts2.visible = true
      hearts3.visible = false
    }
    if(vidas === 1){
      hearts2.visible = false
      hearts1.visible = true
      hearts3.visible = false
    }
    if(vidas === 0){
      
      estadojogo = "lost";
      loseSound.play();
    }
    if(pontos > 200){
      estadojogo = "won";
      winSound.play();
    }

  if(keyDown("UP_ARROW") || touches.length>0){
    player.y = player.y-30;
  }
  if(keyDown("DOWN_ARROW") || touches.length>0){
    player.y = player.y+30;
  }

  if(keyWentDown("SPACE")){
    bullet = createSprite(displayWidth-1150,player.y-30,20,10)
    bullet.velocityX = 20

    bulletGp.add(bullet);
    player.depth = bullet.depth;
    player.depth = player.depth+2;
    player.addImage(shooter_shooting)
    bullets = bullets-1;
    shootSound.play();
  }
  if(keyWentUp("SPACE")){
    player.addImage(shooterImg)
  }

  player.collide(edges[2]);
  player.collide(edges[3]);

  if(bullets===0){
    estadojogo = "bullet";
    loseSound.play();
  }

  if(zombieGp.isTouching(bulletGp)){
    for(var i=0;i<zombieGp.length;i++){
      if(zombieGp[i].isTouching(bulletGp)){
        zombieGp[i].destroy();
        bulletGp.destroyEach();
        pontos = pontos+3;
        shootSound.play();
      }
    }
  }

  if(zombieGp.isTouching(player)){
    loseSound.play();
    for(var i = 0; i<zombieGp.length; i++){
      if(zombieGp[i].isTouching(player)){
        zombieGp[i].destroy();
        vidas = vidas-1;
      }
    }
  }

  zombies();
}
drawSprites();

  textSize(20);
  fill("white")
  text("pontuação:"+pontos, displayWidth-200,displayHeight/2-220);
  text("balas:"+bullets, displayWidth-200,displayHeight/2-250);
  text("vidas:"+vidas,displayWidth-200, displayHeight/2-280);

  if(estadojogo == "lost"){

    textSize(100);
    fill("red");
    text("Voce perdeu", 400, 400);
    zombieGp.destroyEach();
    player.destroy();

  }else if(estadojogo == "won"){

    textSize(100);
    fill("yellow");
    text("Voce ganhou", 400, 400);
    zombieGp.destroyEach();
    player.destroy();
    
  }else if(estadojogo == "bullet"){

    textSize(50);
    fill("yellow");
    text("Voce nao tem mais balas", 400, 400);
    zombieGp.destroyEach();
    player.destroy();
    bulletGp.destroyEach();
    
  }

}

function zombies() {
  if(frameCount%60 === 0){
    zombie = createSprite(random(500,1100),random(100,500),40,40);
    zombie.addImage(zombimg);
    zombie.velocityX = -3;
    zombie.scale = 0.15;
    zombie.setCollider("rectangle",0,0,500,1000);
    zombie.debug = true;
    zombie.lifetime = 400;
    zombieGp.add(zombie);
  }
}