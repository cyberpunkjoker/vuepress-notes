/**
 * canvas 绘制动画函数
 */
// 太阳系动画 —— MDN教程
const drawSolar = (ctx: CanvasRenderingContext2D) => {
  var sun = new Image();
  var moon = new Image();
  var earth = new Image();

  function init(){
    sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
    moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
    earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
    window.requestAnimationFrame(draw);
  }

  function draw() {
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0,0,300,300); // clear canvas

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.strokeStyle = 'rgba(0,153,255,0.4)';
    ctx.save();
    ctx.translate(150,150);

    // Earth
    var time = new Date();
    ctx.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() );
    ctx.translate(105,0);
    ctx.fillRect(0,-12,50,24); // Shadow
    ctx.drawImage(earth,-12,-12);

    // Moon
    ctx.save();
    ctx.rotate( ((2*Math.PI)/6)*time.getSeconds() + ((2*Math.PI)/6000)*time.getMilliseconds() );
    ctx.translate(0,28.5);
    ctx.drawImage(moon,-3.5,-3.5);
    ctx.translate(10,10);

    ctx.restore();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(150,150,105,0,Math.PI*2,false); // Earth orbit
    ctx.stroke();

    ctx.drawImage(sun,0,0,300,300);

    window.requestAnimationFrame(draw);
  }

  init();
}

// 钟表绘制
const drawClock = (ctx: CanvasRenderingContext2D) => {
  const w = 150    // 画布宽度
  const cR = w / 2 // 🕙半径
  const bW = 8     // 🕙边框宽短
  
  const now = new Date()
  const sec = now.getSeconds();
  const min = now.getMinutes();
  const hr  = now.getHours();

  ctx.save()
  ctx.clearRect(0, 0, w, w)
  ctx.translate(cR + bW, cR + bW)    // 原点位置

  ctx.save()
  ctx.strokeStyle = '#000'

  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.rotate(Math.PI/30);
    if ( (i + 1) % 5 === 0) {
      ctx.lineWidth = 2
      ctx.moveTo(cR - 15, 0);
      ctx.lineTo(cR - 25, 0);
    } else {
      ctx.lineWidth = 1
      ctx.moveTo(cR - 15, 0);
      ctx.lineTo(cR - 20, 0);
    }
    ctx.stroke();
  }

  ctx.restore()

  ctx.lineCap = 'round'

  // 秒针
  ctx.save()
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.rotate(Math.PI/30 * sec)
  ctx.strokeStyle = '#D40000'
  ctx.beginPath()
  ctx.moveTo(0,5)
  ctx.lineTo(0,-50)
  ctx.stroke()
  ctx.restore()

  // 分针
  ctx.save()
  ctx.lineWidth = 3
  ctx.rotate(Math.PI/30 * min)
  ctx.strokeStyle = '#000'
  ctx.beginPath()
  ctx.moveTo(0,5)
  ctx.lineTo(0,-40)
  ctx.stroke()
  ctx.restore()

  // 时针
  const hour = hr >= 12 ? hr - 12 : hr
  
  ctx.save()
  ctx.lineWidth = 5
  ctx.rotate(hr*(Math.PI/6) + (Math.PI/360)*min + (Math.PI/21600)*sec)
  ctx.strokeStyle = '#000'
  ctx.beginPath()
  ctx.moveTo(0,5)
  ctx.lineTo(0,-20)
  ctx.stroke()
  ctx.restore()

  ctx.restore()
  window.requestAnimationFrame((e) => {
    drawClock(ctx)
  })

}

// 绘制小球
const drawABall = (ctx: CanvasRenderingContext2D) => {
  const w = 600
  const h = 400

  let ref;

  const ball = {
   x: 100,
   y: 100,
   vx: 9,
   vy: 3,
   radius: 25,
   color: 'blue',
   draw: function() {
     ctx.beginPath();
     ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
     ctx.closePath();
     ctx.fillStyle = this.color;
     ctx.fill()
   }
 }

  function clear() {
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(0,0,w, h);
  }

  function draw() {
    clear()
    ball.draw()

    ball.x += ball.vx
    ball.y += ball.vy

    if (ball.y + ball.vy > h || ball.y + ball.vy < 0) {
      ball.vy = -ball.vy;
      
    }
    if (ball.x + ball.vx > w || ball.x + ball.vx < 0) {
      ball.vx = -ball.vx;
    }
    
    window.requestAnimationFrame(draw);
  }

  draw()

  ball.draw();
}

export default {
  drawSolar,
  drawClock,
  drawABall,
}