// Sprite klasse voor het tekenen van afbeeldingen met animaties
class Sprite {
  constructor({position, imageSrc, frameRate = 1, frameBuffer = 6, scale = 0.5}) {
    this.position = position; 
    this.scale = scale
    this.loaded = false;
    // Laad de afbeelding
    this.image = new Image();
    this.image.onload = () => {
      this.width = (this.image.width / this.frameRate) * this.scale;
      this.height = this.image.height * this.scale;
      this.loaded = true;
    }
    this.image.src = imageSrc;
    this.loaded = false;
    this.frameRate = frameRate;
    this.currentFrame = 0;
    this.frameBuffer = frameBuffer;
    this.elapsedFrames = 0;
  }

  // Teken de volledige afbeelding
  draw() {
    if (!this.loaded) return; 
    c.drawImage(this.image, this.position.x, this.position.y);
  }
  
  // Teken specifiek frame voor animatie
  drawWithSize() {
    if (!this.loaded) return;
    // Bereken welk frame getekend moet worden
    const cropbox = {
      position: {
        x: this.currentFrame * (this.image.width / this.frameRate),
        y: 0,
      },
      width: this.image.width / this.frameRate,
      height: this.image.height,
    }
    c.drawImage(
      this.image, 
      cropbox.position.x,
      cropbox.position.y,
      cropbox.width,
      cropbox.height,
      this.position.x, 
      this.position.y, 
      this.width, 
      this.height
    );
  }

  update() {
    this.draw();
    this.updateFrames();
  }
  
  // Update animatie frames
  updateFrames() {
    this.elapsedFrames++;
    
    // Wissel naar volgend frame na frameBuffer aantal frames
    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0; // Loop terug naar eerste frame
      }
    }
  }
}