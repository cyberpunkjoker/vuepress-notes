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


