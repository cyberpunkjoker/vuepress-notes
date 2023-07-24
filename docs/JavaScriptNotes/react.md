## ahook
该文用于对(`ahook`)[https://ahooks.js.org/zh-CN]的理解解读，从而提升自己对`useHook`的理解。



## react 性能优化 - 基础
1. React.memo
只有当传入的 props 发生变化的时候，子组件才会重新渲染（这里要注意一点，就是应用对象）
2. useMemo
可以用来避免重复计算，如下例。只有依赖项发生变化的时候才会更新。

一些基于 State 的衍生值和一些复杂的计算可以通过 useMemo 进行性能优化。
```js
const memoSum = useMemo(() => {
  console.info('重新计算了吗')
  return arr.reduce((pre, cur) => {
    pre += cur
    return pre
  }, 0)
}, [arr])
```
当上诉两者同时使用的时候，要注意一点：props 变化所引起的子组件变化必然会导致组件的重新渲染，包括`useMemo`
3. useCallback
可以避免子组件的重复渲染。useCallback 是为了**避免由于回调函数引用变动（调用父组件的方法，如果设计的数据和子组件无关，则不更新子组件）**，所导致的子组件非必要重新渲染。（这个子组件有两个前提：首先是接收回调函数作为 props，其次是被 React.memo 所包裹。）


## react 一些使用理解


## react 坑->理解
### 关于组件注销的问题

* **业务场景** --- 在前端微前端中切换到了其它应用后，Notification 组件并未消失，而且轮训接口也在反复的调用中

* **问题原因**
  1. antd Notification 组件是会直接挂载在 body 节点下的
  2. 关于 react 注销事件的传递，如果你直接使用js的原生方法比如 remove 去注销节点，这样是通知不到 react 去注销组件的（因为没有注册）。
  3. 由*2*产生 --> 也就是说你写在注销事件里面的方法是不会触发的。

* **在我的项目中引发了如下的问题**
- 如果有 ws或者轮训接口 不会注销掉
- antd 的 Notification 不会被关闭

正确的做法是使用 reactDom 的 `unmountComponentAtNode` 方法注销。react 18之后的版本 改成了 `unmount()` 方法

这里要注意一点要使用 render 渲染，这样才能通过root1节点注册在`reactDom`，如果少了 `root.render` 的方法的话，他是能用 `unmount()` 注销掉的 ----（*这里原因猜测因该是，父节点是找到了的。但是没有通过 `render` 函数 绑定子节点和父节点的关系所以，直接删除了父节点，但是因为没有绑定也就不会通知下去消息*）----，但是因为没有注册到 `reactDom`上，是不会通知到子节点注销的，所以这时注销事件里面的方法不会触发。还有一点（一般不会出现可忽略）使用 `createRoot` 包裹了之后的根节点，如果它的子节点还有被 `createRoot`包裹的，这时注销事件也发布不下去了。

代码如下所示：-----------------
```jsx
const App:React.FC =() => {
  let root;
  useEffect(() => {
    root = createRoot(document.querySelector('.root1'))

    root.render(<>
      <button onClick={remove}>cccc</button>
      <Layout/>
      <Test></Test>
    </>)
  }, [])

  const remove = () => {
    root.unmount()
  }

  return (
    <div className='root1'>
    </div>
  )
}
```
上诉问题简单了解了只有，就会产生一个新的问题，`react` 的 `createRoot` 到底干了什么？

而要了解这个之前需要知道 `React Fiber` 。

### React Fiber
[参考文章1](https://juejin.cn/post/7077545184807878692)

问题遗留：
1. fiber是在哪个阶段生成的？（猜测是在 render）
2. 卸载的时候是如何通知到子组件的？（猜测因为fiber是个链表的结构，节点存储了父，子，兄节点的信息。所以触发了父的卸载之后，会去fiber上依此查找，通知下面节点的去卸载）。


### Suspense
1. 懒加载 和 Suspense 配合使用

懒加载首次加载页面的时候请求资源时，配合加载 loading 使用
```js
function lazyImportComp(compPath?: string) {
  if (!compPath) return;

  return lazy(() => import(`@/pages${compPath}`));
}

<Suspense fallback={<div>Loading...</div>} key={cur.path}>
  <Route path={cur.path} exact key={cur.path} component={lazyImportComp(cur.component)} />
</Suspense>
```


### fiber 理解




## 前端路由
1. hash 路由 主要是使用的 `hashchange` 监听哈希路由的变化 

```js
window.addEventListener('hashchange', changeView)

function changeView() {
  
  switch (location.hash) {
    case '#/home':
      routeView.innerHTML = 'home'
      break;
    case '#/about':
      routeView.innerHTML = 'about'
      break;
  }
}
```

2. history 路由主要是使用 `history.pushState` 推入，然后再使用 `popstate`监听变化

```js
window.addEventListener('popstate', changeView)

event.addEventListener('click', (e) => {
    if(e.target.nodeName === 'A'){
        e.preventDefault()

        history.pushState(null, "", e.target.getAttribute('href'))

        changeView()
    }

})

function changeView() {
    switch (location.pathname) {
        case '/home':
            routeView.innerHTML = 'home'
            break;
        case '/about':
            routeView.innerHTML = 'about'
            break;
    }
}
```