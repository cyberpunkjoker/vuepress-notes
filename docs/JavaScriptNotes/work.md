## 富文本编辑器



## 直播间



## search-table 组件



## 平时遇到的一些笔记📒
1. 判断有无传参，并对传参为 undefined 特殊处理
```js
// 箭头函数无 arguments 参数
function fun(date) {
  if (Object.prototype.hasOwnProperty.call(arguments, '0')) { // 判断传参有无
    if (arguments[0] === undefined) { // 参数是否为空
      console.log(arguments[0]);
    }else {
      console.log(arguments[0]);
      return xxx(date)
    }
  } else {
    console.log('无传参数');
  }
} 
fun()          // 无传参数
fun(undefined) // undefined
fun('wewe')    // wewe
```

2. 加载网络图片使用 onload 不触发
（缓存问题）解决方案, 怎么判断图片是否有缓存。
```js
// 同步加载图片
export function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image()
    img.src = src
    img.style.display = 'none'
    document.body.appendChild(img)

    resolveImg(img, () => {
      document.body.removeChild(img)
      resolve(img)
    })
  })
}

// 判断图片是否加载完成
function resolveImg(img, callback) {
  if (img.complete) {
    callback()
  } else {
    setTimeout(() => resolveImg(img, callback), 50)
  }
}
```

3. 关于浮窗设计遇到的一些问题。
- 3.1 浮窗设计一般不要和按钮设计在一起


4. 拖拽时 善用委托事件
尝试一下设计一个组件（委托事件如何处理）, 外面套一层