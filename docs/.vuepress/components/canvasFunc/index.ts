import dlamPic from '../../asset/v2-3f5ddc2367c78d252d1a963843100c1e_r.jpeg'


const drawSimleFace = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // 绘制
  ctx.moveTo(75 + Math.sqrt(35**2 - 17.5**2) , 75 + 17.5);
  ctx.arc(75, 75, 35, Math.PI / 180 * 30, Math.PI / 180 * 150, false);   // 口(顺时针)
  ctx.moveTo(65, 65);
  ctx.arc(60, 65, 5, 0, Math.PI * 2, true);  // 左眼
  ctx.moveTo(95, 65);
  ctx.arc(90, 65, 5, 0, Math.PI * 2, true);  // 右眼
  ctx.stroke();
}

const drawBezier = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath()
  ctx.moveTo(75, 25)
  ctx.quadraticCurveTo(25, 25, 25, 62.5);
  ctx.quadraticCurveTo(25, 100, 50, 100);
  ctx.quadraticCurveTo(50, 120, 30, 125);
  ctx.quadraticCurveTo(60, 120, 65, 100);
  ctx.quadraticCurveTo(125, 100, 125, 62.5);
  ctx.quadraticCurveTo(125, 25, 75, 25);
  ctx.stroke()
}

const drawCubicBezier = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath()
  ctx.moveTo(75, 40);
  ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
  ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
  ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
  ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
  ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
  ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
  ctx.fill()
}

const drawFillStyleList = (ctx: CanvasRenderingContext2D) => {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      ctx.fillStyle = `
      rgb(
        0, 
        ${Math.floor(255-42.5*i)}, 
        ${Math.floor(255-42.5*j)}
      )`
      ctx.fillRect(j*25, i*25, 25, 25)
    }
  }
 
} 

const drawStrokeStyleList = (ctx: CanvasRenderingContext2D) => {
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      ctx.strokeStyle = `
      rgb(
        0, 
        ${Math.floor(255-42.5*i)}, 
        ${Math.floor(255-42.5*j)}
      )`
      ctx.beginPath()
      ctx.arc(12.5+j*25,12.5+i*25,10,0,Math.PI*2,true)
      ctx.stroke()
    }
  }
}

const drawSomeLine = (ctx: CanvasRenderingContext2D) => {
  // width && cap 使用
  const capType: ['butt', 'round', 'square'] = ['butt', 'round', 'square']
  for (let i = 0; i < 3; i++) {
    ctx.lineWidth = (i + 1) *2
    ctx.lineCap = capType[i]
    ctx.beginPath()
    ctx.moveTo (15+i*14, 10)
    ctx.lineTo (15+i*14, 150)
    ctx.stroke()
  }
  // join 使用
  const joinType:['round', 'bevel', 'miter'] = ['round', 'bevel', 'miter']
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.lineWidth = 5
    ctx.lineJoin = joinType[i]
    ctx.moveTo(80, 5 + i * 40);
    ctx.lineTo(120, 45 + i * 40);
    ctx.lineTo(160, 5 + i * 40);
    ctx.lineTo(200, 45 + i * 40);
    ctx.stroke();  
  }

  // 最大长度展示
  ctx.strokeStyle = 'red';
  ctx.lineWidth   = 2;
  ctx.strokeRect(250, 50, 106, 50);

  ctx.beginPath();
  ctx.moveTo(250, 100);
  ctx.miterLimit = 10;
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 10;
  for (let i = 0; i < 15 ; i++) {
    var dy = i % 2 == 0 ? 25 : -25;
    ctx.lineWidth = 3
    ctx.lineTo(Math.pow(i, 1.5) * 2 + 250, 75 + dy);
  }
  ctx.stroke()

  let offset = 0;
  function draw() {
    ctx.clearRect(380, 0, 121, 111);
    ctx.setLineDash([4, 2]);
    ctx.lineWidth = 1
    ctx.strokeStyle = '#000'
    ctx.lineDashOffset = - offset;
    ctx.strokeRect(400,10, 100, 100);
  }
  
  const march = () => {
    offset++;
    if (offset > 16) {
      offset = 0;
    }
    draw();
    setTimeout(march, 20);
  }
  march();

  // 重点提示区域
  // 图一
  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.ellipse(30, 11, 25, 10, 0 * Math.PI/180, 0, 2 * Math.PI)
  ctx.strokeStyle = 'red'
  ctx.stroke()
  // 图二
  ctx.beginPath()
  ctx.lineWidth = 1
  ctx.ellipse(120, 75, 70, 15, 90 * Math.PI/180, 0, 2 * Math.PI)
  ctx.strokeStyle = 'red'
  ctx.stroke()

}

const drawGradients = (ctx: CanvasRenderingContext2D) => {
  const lingrad = ctx.createLinearGradient(0,0,0,150);
  lingrad.addColorStop(0, '#00ABEB');
  lingrad.addColorStop(0.5, '#fff');
  lingrad.addColorStop(0.5, '#26C000');
  lingrad.addColorStop(1, '#fff');

  ctx.fillStyle = lingrad;
  ctx.fillRect(10,10,130,130);

  const radgrad = ctx.createRadialGradient(245,45,10,252,50,30);
  radgrad.addColorStop(0, '#A7D30C');
  radgrad.addColorStop(0.9, '#019F62');
  radgrad.addColorStop(1, 'rgba(1,159,98,0)');

  // 画图形
  ctx.fillStyle = radgrad;
  ctx.fillRect(100,0,200,200);
}


const drawPatterns = (ctx: CanvasRenderingContext2D) => {
  const img = new Image();
  img.src = 'https://mdn.mozillademos.org/files/222/Canvas_createpattern.png';
  img.onload = function() {
     // 创建图案
    var ptrn = ctx.createPattern(img, 'repeat');
    ctx.fillStyle = ptrn;
    ctx.fillRect(0, 0, 150, 150);
  }
}

const drawSomeText = (ctx: CanvasRenderingContext2D) => {
  ctx.font = "18px serif";
  ctx.fillText('绘制文本', 5, 20)
  ctx.font = "25px serif";
  ctx.strokeText('边框文字 ', 5, 45)
  
  // 设置文本样式
  ctx.font = "2px, sans-serif"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.direction = 'rtl'
  ctx.fillText('文本样式设置', 200, 20)

  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 2;
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

  ctx.font = "20px Times New Roman";
  ctx.fillStyle = "Black";
  ctx.fillText("文字阴影", 60, 95);

}

const drawPic = (ctx: CanvasRenderingContext2D) => {
  const img = new Image();
  img.onload = () => {
    // 绘制图片
    ctx.drawImage(img, 0, 0, 150, 150)
    // 添加其它图案
    ctx.beginPath()
    ctx.strokeStyle = 'red'
    ctx.lineWidth = 2
    ctx.moveTo(0, 0)
    ctx.lineTo(150, 150)
    ctx.moveTo(150, 0)
    ctx.lineTo(0, 150)
    ctx.stroke()
  }
  img.src = dlamPic

  // 切片
  const remoteImg = new Image()
  remoteImg.onload = () => {
    ctx.drawImage(remoteImg, 
      33,71,104,124,
      185,20, 87,104
    )
  }
  remoteImg.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg'

}

const drawWithSave = (ctx: CanvasRenderingContext2D) => {
  ctx.fillRect(0,0,150,150);
  ctx.save(); 

  ctx.fillStyle = '#09F'
  ctx.fillRect(15,15,120,120);

  ctx.save();
  ctx.fillStyle = '#FFF'
  ctx.globalAlpha = 0.5;
  ctx.fillRect(30,30,90,90);

  ctx.restore();
  ctx.fillRect(45,45,60,60);

  ctx.restore();
  ctx.fillRect(60,60,30,30);
}

const drawTranslate = (ctx: CanvasRenderingContext2D) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      // 这里保存的是原始的 原点位置
      ctx.save();
      ctx.fillStyle = 'rgb(' + (51 * i) + ', ' + (255 - 51 * i) + ', 255)';
      ctx.translate(10 + j * 50, 10 + i * 50);
      ctx.fillRect(0, 0, 25, 25);
      ctx.restore(); // 每循环一次就回复到 0，0 开始
    }
  }
}

const drawRotating = (ctx:CanvasRenderingContext2D) => {
  ctx.translate(75,75);

  for (var i=1;i<6;i++){ // Loop through rings (from inside to out)
    ctx.save();
    ctx.fillStyle = 'rgb('+(51*i)+','+(255-51*i)+',255)';

    for (var j=0;j<i*6;j++){ // draw individual dots
      ctx.rotate(Math.PI*2/(i*6));
      ctx.beginPath();
      ctx.arc(0,i*12.5,5,0,Math.PI*2,true);
      ctx.fill();
    }

    ctx.restore();
  }

}

export default {
  drawSimleFace,
  drawBezier,
  drawCubicBezier,
  drawFillStyleList,
  drawStrokeStyleList,
  drawSomeLine,
  drawGradients,
  drawPatterns,
  drawSomeText,
  drawPic,
  drawWithSave,
  drawTranslate,
  drawRotating
}