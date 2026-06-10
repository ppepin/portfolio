class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.initParticles();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  generateLabel() {
    const stars = ['sirius', 'canopus', 'arcturus', 'vega', 'capella', 'rigel', 'procyon', 'betelgeuse', 'achernar', 'hadar', 'altair', 'aldebaran', 'spica', 'antares', 'pollux', 'fomalhaut', 'deneb', 'regulus', 'castor'];
    const star = stars[Math.floor(Math.random() * stars.length)];
    const digit = Math.floor(Math.random() * 9) + 1;
    return `${star}00${digit}`;
  }

  initParticles() {
    this.particles = [];
    const count = Math.min(window.innerWidth / 10, 100);
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2 + 1,
        label: Math.random() < 0.15 ? this.generateLabel() : null,
        hue: Math.random() * 360
      });
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const isJune = new Date().getMonth() === 5;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const pColor = isDark ? 'rgba(88, 166, 255, 0.6)' : 'rgba(0, 102, 204, 0.4)';
    const lColor = isDark ? 'rgba(88, 166, 255,' : 'rgba(0, 102, 204,';
    const tColor = isDark ? 'rgba(150, 200, 255,' : 'rgba(50, 100, 150,';

    this.ctx.font = "10px 'Courier New', Courier, monospace";
    
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      if (isJune) {
        p.hue = (p.hue + 0.5) % 360;
        this.ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, 0.6)`;
      } else {
        this.ctx.fillStyle = pColor;
      }
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      if (p.label) {
        this.ctx.fillStyle = isJune ? `hsla(${p.hue}, 100%, 75%, 0.8)` : `${tColor} 0.8)`;
        this.ctx.fillText(p.label, p.x + 8, p.y + 4);
      }
    });

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          this.ctx.beginPath();
          if (isJune) {
            this.ctx.strokeStyle = `hsla(${(p1.hue + p2.hue) / 2}, 100%, 60%, ${1 - dist/150})`;
          } else {
            this.ctx.strokeStyle = `${lColor} ${1 - dist/150})`;
          }
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ParticleNetwork('particle-canvas');
});
