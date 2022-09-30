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


## 组件传参
父组件如何调用，子组件的方法？

涉及的 hook 有 `forwardRef` 和 `useImperativeHandle`两个 hook 配合使用
```jsx
// 1. 在组件外部包一层 forwardRef
const SearchTable: React.FC<ISearchTable> = forwardRef((props, ref) => {

  // 2. 然后通过 useImperativeHandle 将要提供给父组件的方法 抛出
  useImperativeHandle(ref, () => ({
    refreshData,
  }))
}
//  -------------父组件------------------
  searchTableRef.current.refreshData()
  <SearchTable
    ref={searchTableRef}
  />
```