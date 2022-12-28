## css有趣属性介绍
1. mix-blend-mode 混合模式
- 不仅各个图像之间要进行混合，同时还要和背景色进行混合。
Demo: 
```css
div {
  height: 100vh;
  background: linear-gradient(45deg, #000 0, #000 50%, #fff 50%);
}

div::before {
  content: "LOREM IPSUM";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  mix-blend-mode: hard-light;
  animation: move 3s infinite linear alternate;
}

@keyframes move {
  0% {
    transform: translate(-30%, -50%);
  }
  100% {
    transform: translate(-70%, -50%);
  }
}
```