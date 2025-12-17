export default class GameEngine {
  constructor(canvas, callbacks) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.callbacks = callbacks;
    
    this.setupCanvas();
    this.init();
    this.setupControls();
  }

  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    
    this.width = 800;
    this.height = 600;
    
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    
    this.ctx.scale(dpr, dpr);
  }

  init() {
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.paused = false;
    this.running = false;
    
    this.player = {
      x: 100,
      y: 400,
      radius: 20,
      vx: 0,
      vy: 0,
      speed: 5,
      jumpPower: 12,
      onGround: false,
      color: '#FF6B6B'
    };

    this.gravity = 0.5;
    this.friction = 0.85;
    this.bounce = 0.6;

    this.keys = {};
    this.mobileControls = {
      left: false,
      right: false
    };

    this.platforms = this.generateLevel(this.level);
    this.collectibles = [];
    this.generateCollectibles();
    this.enemies = [];
    this.generateEnemies();
    this.camera = { x: 0, y: 0 };
    this.levelEnd = this.width * 3;
  }

  generateLevel(level) {
    const platforms = [
      { x: 0, y: this.height - 50, width: this.width * 4, height: 50, color: '#2ecc71' }
    ];

    const platformCount = 10 + level * 3;
    for (let i = 0; i < platformCount; i++) {
      platforms.push({
        x: 200 + i * 300 + Math.random() * 100,
        y: this.height - 150 - Math.random() * 300,
        width: 100 + Math.random() * 100,
        height: 20,
        color: '#27ae60'
      });
    }

    return platforms;
  }

  generateCollectibles() {
    this.collectibles = [];
    for (let i = 0; i < 20 + this.level * 5; i++) {
      this.collectibles.push({
        x: 300 + i * 150 + Math.random() * 100,
        y: 100 + Math.random() * 300,
        radius: 10,
        collected: false,
        color: '#FFD700',
        value: 10
      });
    }
  }

  generateEnemies() {
    this.enemies = [];
    for (let i = 0; i < 3 + this.level; i++) {
      this.enemies.push({
        x: 500 + i * 400,
        y: this.height - 100,
        width: 30,
        height: 30,
        vx: 2,
        color: '#e74c3c',
        minX: 500 + i * 400 - 100,
        maxX: 500 + i * 400 + 100
      });
    }
  }

  setupControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
      if (e.key === ' ' || e.key === 'w' || e.key === 'ArrowUp') {
        e.preventDefault();
        this.jump();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
  }

  handleMobileInput(action) {
    switch(action) {
      case 'left-start':
        this.mobileControls.left = true;
        break;
      case 'left-end':
        this.mobileControls.left = false;
        break;
      case 'right-start':
        this.mobileControls.right = true;
        break;
      case 'right-end':
        this.mobileControls.right = false;
        break;
      case 'jump':
        this.jump();
        break;
    }
  }

  jump() {
    if (this.player.onGround && !this.paused) {
      this.player.vy = -this.player.jumpPower;
      this.player.onGround = false;
    }
  }

  update() {
    if (this.paused) return;

    if (this.keys['ArrowLeft'] || this.keys['a'] || this.mobileControls.left) {
      this.player.vx = -this.player.speed;
    } else if (this.keys['ArrowRight'] || this.keys['d'] || this.mobileControls.right) {
      this.player.vx = this.player.speed;
    } else {
      this.player.vx *= this.friction;
    }

    this.player.vy += this.gravity;
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;

    this.player.onGround = false;
    for (const platform of this.platforms) {
      if (this.checkPlatformCollision(this.player, platform)) {
        this.player.onGround = true;
        this.player.vy = 0;
        this.player.y = platform.y - this.player.radius;
      }
    }

    if (this.player.x < this.player.radius) {
      this.player.x = this.player.radius;
      this.player.vx = 0;
    }

    if (this.player.y > this.height + 100) {
      this.loseLife();
    }

    this.camera.x = this.player.x - this.width / 3;
    if (this.camera.x < 0) this.camera.x = 0;

    for (const item of this.collectibles) {
      if (!item.collected && this.checkCircleCollision(this.player, item)) {
        item.collected = true;
        this.score += item.value;
        this.callbacks.onScoreUpdate(this.score);
      }
    }

    for (const enemy of this.enemies) {
      enemy.x += enemy.vx;
      if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
        enemy.vx *= -1;
      }

      if (this.checkEnemyCollision(this.player, enemy)) {
        if (this.player.vy > 0 && this.player.y < enemy.y) {
          this.player.vy = -8;
          this.score += 50;
          this.callbacks.onScoreUpdate(this.score);
          enemy.x = -1000;
        } else {
          this.loseLife();
        }
      }
    }

    if (this.player.x > this.levelEnd) {
      this.nextLevel();
    }
  }

  checkPlatformCollision(circle, rect) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    
    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;
    
    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    
    return distanceSquared < (circle.radius * circle.radius) && circle.vy >= 0 && circle.y < rect.y + rect.height / 2;
  }

  checkCircleCollision(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < c1.radius + c2.radius;
  }

  checkEnemyCollision(circle, rect) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    
    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;
    
    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    
    return distanceSquared < (circle.radius * circle.radius);
  }

  loseLife() {
    this.lives--;
    this.callbacks.onLivesUpdate(this.lives);
    
    if (this.lives <= 0) {
      this.callbacks.onGameOver();
      this.stop();
    } else {
      this.player.x = 100;
      this.player.y = 400;
      this.player.vx = 0;
      this.player.vy = 0;
    }
  }

  nextLevel() {
    this.level++;
    this.callbacks.onLevelUpdate(this.level);
    this.score += 100;
    this.callbacks.onScoreUpdate(this.score);
    
    this.player.x = 100;
    this.player.y = 400;
    this.player.vx = 0;
    this.player.vy = 0;
    
    this.platforms = this.generateLevel(this.level);
    this.generateCollectibles();
    this.generateEnemies();
    this.levelEnd = this.width * 3;
    this.camera.x = 0;
  }

  render() {
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.save();
    this.ctx.translate(-this.camera.x, 0);

    for (const platform of this.platforms) {
      this.ctx.fillStyle = platform.color;
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      
      this.ctx.fillStyle = '#229954';
      for (let i = 0; i < platform.width; i += 10) {
        this.ctx.fillRect(platform.x + i, platform.y, 2, 5);
      }
    }

    for (const item of this.collectibles) {
      if (!item.collected) {
        this.ctx.fillStyle = item.color;
        this.ctx.beginPath();
        this.ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.beginPath();
        this.ctx.arc(item.x - 3, item.y - 3, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    for (const enemy of this.enemies) {
      if (enemy.x > -1000) {
        this.ctx.fillStyle = enemy.color;
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillRect(enemy.x + 5, enemy.y + 5, 8, 8);
        this.ctx.fillRect(enemy.x + 17, enemy.y + 5, 8, 8);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(enemy.x + 8, enemy.y + 8, 3, 3);
        this.ctx.fillRect(enemy.x + 20, enemy.y + 8, 3, 3);
      }
    }

    this.ctx.fillStyle = '#FFD700';
    this.ctx.fillRect(this.levelEnd - 10, this.height - 150, 10, 100);
    this.ctx.fillStyle = '#FF6B6B';
    this.ctx.beginPath();
    this.ctx.moveTo(this.levelEnd, this.height - 150);
    this.ctx.lineTo(this.levelEnd + 40, this.height - 130);
    this.ctx.lineTo(this.levelEnd, this.height - 110);
    this.ctx.fill();

    const gradient = this.ctx.createRadialGradient(
      this.player.x, this.player.y, 0,
      this.player.x, this.player.y, this.player.radius
    );
    gradient.addColorStop(0, '#FF8E8E');
    gradient.addColorStop(1, this.player.color);
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
    this.ctx.beginPath();
    this.ctx.arc(this.player.x - 6, this.player.y - 6, 6, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  gameLoop = () => {
    if (!this.running) return;
    
    this.update();
    this.render();
    
    requestAnimationFrame(this.gameLoop);
  }

  start() {
    this.running = true;
    this.gameLoop();
  }

  stop() {
    this.running = false;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  restart() {
    this.init();
    this.callbacks.onScoreUpdate(this.score);
    this.callbacks.onLevelUpdate(this.level);
    this.callbacks.onLivesUpdate(this.lives);
    if (!this.running) {
      this.start();
    }
  }
}

