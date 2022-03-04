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
  ctx.arc(0, 0, cR, 0, Math.PI * 2); // 绘制
  ctx.lineWidth = bW
  ctx.strokeStyle = '#325FA2'
  // ctx.stroke();

  ctx.save()
  ctx.strokeStyle = '#000'

  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    ctx.rotate(Math.PI/30);
    if ( (i + 1) % 5 === 0) {
      ctx.lineWidth = 2
      ctx.moveTo(cR - 15,0);
      ctx.lineTo(cR - 25,0);
    }else {
      ctx.lineWidth = 1
      ctx.moveTo(cR - 15,0);
      ctx.lineTo(cR - 20,0);
    }
    ctx.stroke();
  }

  ctx.restore()

  // 秒针
  ctx.save()
  ctx.lineWidth = 2
  ctx.rotate(Math.PI/30 * sec)
  ctx.strokeStyle = '#D40000'
  ctx.beginPath()
  ctx.moveTo(0,0)
  ctx.lineTo(50,0)
  ctx.stroke()
  ctx.restore()

  // 分针
  ctx.save()
  ctx.lineWidth = 3
  ctx.rotate(Math.PI/30 * min)
  ctx.strokeStyle = '#000'
  ctx.beginPath()
  ctx.moveTo(0,0)
  ctx.lineTo(40,0)
  ctx.stroke()
  ctx.restore()

  // 时针
  const hour = hr > 12 ? hr-1 : hr
  ctx.save()
  ctx.lineWidth = 5
  ctx.rotate(Math.PI/30 * hour )
  ctx.strokeStyle = '#000'
  ctx.beginPath()
  ctx.moveTo(0,0)
  ctx.lineTo(20,0)
  ctx.stroke()
  ctx.restore()

  ctx.restore()

  window.requestAnimationFrame(() => drawClock(ctx))

}

export default {
  drawSolar,
  drawClock
}