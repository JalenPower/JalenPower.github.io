// Collision block klasse voor vloeren, muren en platforms
class CollisionBlock {
    constructor({ position }) {
        this.position = position;
        this.width = 16;
        this.height = 16;
    }

    // Teken de collision block (rood semi-transparant)
    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0.5)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

    }
}