  // Haal het canvas element en context op
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Stel canvas afmetingen in
canvas.width = 1024;
canvas.height = 576;

// Zwaartekracht constante
const gravity = 0.25;

// Geschaalde canvas dimensies voor pixel art
const scaledcanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4
}

// Converteer 1D collision array naar 2D array (36 breed)
const floorCollision2d = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
floorCollision2d.push(floorCollisions.slice(i, i + 36));
}

// Maak collision block objecten voor vloeren en muren
const collisionBlocks = []
floorCollision2d.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      )
    }
  })
})

// Converteer platform collision array naar 2D
const platformCollision2d = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollision2d.push(platformCollisions.slice(i, i + 36));
}

// Maak platform collision blocks (waar je doorheen kunt vallen)
const platformCollisionBlocks = [];
platformCollision2d.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      )
    }
  })
})

// Maak de speler met startpositie en animaties
const player = new Player({
  position: {
    x: 162,
    y: 300,
  },
  collisionBlocks: collisionBlocks,
  platformCollision2D: platformCollisionBlocks,
  imageSrc: './sprites/warrior/Idle.png',
  frameRate: 8,
  // Alle speler animaties met frame settings
  animations: {
    Idle: {
      imageSrc: './sprites/warrior/Idle.png',
      frameRate: 8,
      frameBuffer: 7,
    },
    Run: {
      imageSrc: './sprites/warrior/Run.png',
      frameRate: 8,
      frameBuffer: 7,
    },
    Jump: {
      imageSrc: './sprites/warrior/Jump.png',
      frameRate: 2,
      frameBuffer: 3,
  },
    Fall: {
      imageSrc: './sprites/warrior/Fall.png',
      frameRate: 2,
      frameBuffer: 3,
},
Fallleft: {
      imageSrc: './sprites/warrior/FallLeft.png',
      frameRate: 2,
      frameBuffer: 3,
    },
    Runleft: {
      imageSrc: './sprites/warrior/RunLeft.png',
      frameRate: 8,
      frameBuffer: 7,
    },
    Idleleft: {
      imageSrc: './sprites/warrior/IdleLeft.png',
      frameRate: 8,
      frameBuffer: 7,
  },
  Jumpleft: {
      imageSrc: './sprites/warrior/JumpLeft.png',
      frameRate: 2,
      frameBuffer: 3,
}
  }
});


// Track welke toetsen ingedrukt zijn
const keys = {
  d: {
    pressed: false
  },
  a: {
    pressed: false
  }
};

// Achtergrond afbeelding
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './sprites/background.png'
});

const backgroundImageHeight = 432;

// Camera positie (start onderaan)
const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledcanvas.height,
  }
};

// Hoofdanimatie loop die elke frame wordt aangeroepen
function animate() {
  window.requestAnimationFrame(animate);
  // Maak canvas leeg met witte achtergrond
  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  // Wacht tot alle afbeeldingen geladen zijn
  if (!player.loaded || !background.loaded) return;
  
  // Bewaar canvas staat en pas transformaties toe
  c.save();
  c.scale(4, 4); // Vergroot voor pixel art effect
  c.translate(camera.position.x, camera.position.y); // Beweeg voor camera
  // Teken achtergrond
  background.update();

  // Controleer canvas grenzen en update speler
  player.checkForHorizontalcanvasCollisions();
  player.update();

  c.restore(); // Herstel canvas staat

  // Reset horizontale snelheid (wordt elke frame opnieuw ingesteld)
  player.velocity.x = 0;
  // Beweging naar rechts (D toets)
  if (keys.d.pressed) {
    player.velocity.x = 1;
    player.switchAnimation('Run');
    player.lastdirection = 'right';
    player.shouldpanToTheLeft({camerabox: player.camerabox, canvas, camera});
  } // Beweging naar links (A toets)
  else if (keys.a.pressed) {
    player.velocity.x = -1;
    player.switchAnimation('Runleft');
    player.lastdirection = 'left';
    player.shouldpanToTheRight({camerabox: player.camerabox, canvas, camera});
  } // Geen beweging - idle animatie
  else {
    if (player.lastdirection === 'right') {
    player.switchAnimation('Idle');  
    }
      else {
      player.switchAnimation('Idleleft');
    }
  }
  // Springen (negatieve y snelheid = omhoog)
  if (player.velocity.y < 0) {
    player.shouldpanUp({camerabox: player.camerabox, canvas, camera});
    player.switchAnimation('Jump');
    if (player.lastdirection === 'left') {
      player.switchAnimation('Jumpleft');
    }
  }
  // Vallen (positieve y snelheid = naar beneden)
  else if (player.velocity.y > 0) {
    player.shouldpanDown({camerabox: player.camerabox, canvas, camera});
    if (player.lastdirection === 'right') {
    player.switchAnimation('Fall');
    }
    if (player.lastdirection === 'left') {
    player.switchAnimation('Fallleft');
    }
  }
}

// Start de animatie loop
animate();

// Luister naar toetsenbord input (indrukken)
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd': // Rechts bewegen
      keys.d.pressed = true;
      break;
    
    case 'a': // Links bewegen
      keys.a.pressed = true;
      break;
    
    case 'w': // Springen
      console.log('im moving up');
      player.velocity.y = -7;
      break;
  }
});

// Luister naar toetsenbord input (loslaten)
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }
});

