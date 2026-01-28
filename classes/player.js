// Speler klasse die erft van Sprite
class Player extends Sprite {
  constructor({position, collisionBlocks, platformCollision2D, imageSrc, frameRate, animations}) {
   super({imageSrc, position, frameRate});
    // Positie van de speler
    this.position = position;
    // Snelheid van beweging (x = horizontaal, y = verticaal)
    this.velocity = {
        x: 0,
        y: 1
    };
    // Collision blocks voor vloer en muren
    this.collisionBlocks = collisionBlocks; 
    // Platform collision blocks waar je doorheen kunt vallen
    this.platformCollision2D = platformCollision2D;
    // Hitbox voor botsingsdetectie
    this.hitbox = {
      position: {
        x: this.position.x + 4,
        y: this.position.y + 4,
      },
    };
    this.width = 25;
    this.height = 25; 
    // Alle animaties (idle, run, jump, etc.)
    this.animations = animations;
    // Laatste richting waar de speler naar keek
    this.lastdirection = 'right';

// Laad alle animatie afbeeldingen
for (let key in this.animations) {
  const image = new Image();
  image.src = this.animations[key].imageSrc;
  this.animations[key].image = image;
  };
    // Camera box om te bepalen wanneer de camera moet bewegen
    this.camerabox = {
    position: {
      x: this.position.x,
      y: this.position.y,
    },
    width: 200,
    height: 120,
  };
}
    switchAnimation(key) {
    if (!this.animations[key].image) return;
    if (this.image === this.animations[key].image) return;
    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameBuffer = this.animations[key].frameBuffer;
    this.frameRate = this.animations[key].frameRate;
  }

updateCamerabox() {
    this.camerabox = {
      position: {
        x: this.position.x - 100,
        y: this.position.y - 60,
      },
      width: 200,
      height: 120,
    };
  }

  checkForHorizontalcanvasCollisions() {
    if (this.hitbox.position.x + this.hitbox.width >= 576) {
      const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
      this.position.x = 576 - offset;
    }
    
    if (this.hitbox.position.x <= 0) {
      const offset = this.hitbox.position.x - this.position.x;
      this.position.x = -offset;
    }
  }

  // Beweeg camera naar links wanneer speler naar rechts loopt
  shouldpanToTheLeft({camerabox, canvas, camera}) {
   const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;
   const scaledcanvasWidth = canvas.width / 4;

// Stop camera aan rechterkant van de wereld
if (cameraboxRightSide >= 576) return;

   if (cameraboxRightSide >= scaledcanvasWidth + Math.abs(camera.position.x)) {
    camera.position.x -= this.velocity.x;
    }
  }

  // Beweeg camera naar rechts wanneer speler naar links loopt
  shouldpanToTheRight({camerabox, canvas, camera}) {
   const cameraboxLeftSide = this.camerabox.position.x;
    const scaledcanvasWidth = canvas.width / 4;
// Stop camera aan linkerkant van de wereld
if (cameraboxLeftSide <= 0) return;

   if (cameraboxLeftSide <= Math.abs(camera.position.x)) {
    camera.position.x -= this.velocity.x;
    }
  }

  // Beweeg camera omhoog wanneer speler springt
  shouldpanUp({camerabox, canvas, camera}) {
    if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
      camera.position.y -= this.velocity.y;
    }
    
    // Voorkom dat camera boven de bovenkant van de wereld gaat
    if (camera.position.y > 0) {
      camera.position.y = 0;
    }
  }
  
  // Beweeg camera omlaag wanneer speler valt
  shouldpanDown({camerabox, canvas, camera}) {
const scaledCanvasHeight = canvas.height / 4;

if (
  this.camerabox.position.y + this.camerabox.height >=
  Math.abs(camera.position.y) + scaledCanvasHeight
) {
  camera.position.y -= this.velocity.y;
}

// Voorkom dat camera voorbij de onderkant van de wereld gaat
const maxCameraY = -(432 - scaledCanvasHeight);
if (camera.position.y < maxCameraY) {
  camera.position.y = maxCameraY;
}
  }

  // Update alle speler eigenschappen elke frame
  update() {
    this.drawWithSize();
    this.updateFrames();
    this.updateHitbox();
    this.updateCamerabox();
    this.position.x += this.velocity.x;
    this.updateHitbox();
    this.checkForHorizontalCollisions();
    this.ApplyGravity();
    this.updateHitbox();
    this.checkForVerticalCollisions();
    this.checkForPlatformCollisions();
    }
 updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 35,
        y: this.position.y + 26,
      },
      width: this.width - 70,
      height: this.height - 32,
    };
  }


    // Controleer horizontale botsingen met muren
    checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
    
      if (
        collision({object1: this.hitbox, object2: collisionBlock})) {
        // Beweegt naar rechts
        if (this.velocity.x > 0) {
          this.velocity.x = 0;

const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;

          this.position.x = 
          collisionBlock.position.x - offset - 0.01;
          break;
        }
    if (this.velocity.x < 0) {
        this.velocity.x = 0;

const offset = this.hitbox.position.x - this.position.x;

        this.position.x = 
        collisionBlock.position.x + collisionBlock.width - offset + 0.01;
        break;
  }
}  }
  }

  // Pas zwaartekracht toe zodat speler naar beneden valt
  ApplyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y
  }

  // Controleer verticale botsingen met vloer en plafond
  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
    
      
      if (
        collision({object1: this.hitbox, object2: collisionBlock})) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;

const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = 
          collisionBlock.position.y - offset - 0.01;
          break;
        }
    if (this.velocity.y < 0) {
        this.velocity.y = 0;

const offset = this.hitbox.position.y - this.position.y;

        this.position.y = 
        collisionBlock.position.y + collisionBlock.height - offset + 0.01;
        break;
      }
        }
      }
    }

  // Controleer botsingen met platforms (waar je bovenop kunt landen)
  checkForPlatformCollisions() {
    for (let i = 0; i < this.platformCollision2D.length; i++) {
      const platformCollision2D = this.platformCollision2D[i];
    
      // Alleen botsing als je valt en van boven komt
      if (
        collision({object1: this.hitbox, object2: platformCollision2D}) && 
        this.velocity.y > 0 &&
        this.hitbox.position.y + this.hitbox.height <= platformCollision2D.position.y + this.velocity.y
      ) {
          this.velocity.y = 0;

const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

          this.position.y = 
          platformCollision2D.position.y - offset - 0.01;
          break;
        }
      }
    }
}