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


export default {
  drawSimleFace,
  drawBezier,
  drawCubicBezier,
  drawFillStyleList,
  drawStrokeStyleList
}