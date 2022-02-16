### 切片
获取前N个元素 (Slice)
字符串也可用该方法
```python
  L = [1,2,3,4,5,6]
  L[0:3]    # 获取从 0-3 的元素
  L[:3]     # 获取前三个元素
  L[-3:]    # 获取后三个元素
  L[:6:3]   # 每隔三个取一个 [1,4]
  L[:]      # 复制一个list
```

### 迭代
只要是可迭代对象，就可以使用 for 循环
```python
d = {'a': 1, 'b': 2, 'c': 3}
# 1. 遍历key
for k in d:
# 2. 遍历value
for v in d.values():
# 3. 遍历key && value
for k, v in d.items():
```

:::tip 问题集
1. python 中如何实现下标迭代？
2. 判断对象是否是可迭代？
```python
from collections.abc import Iterable
isinstance('abc', Iterable) # str是否可迭代

for i, value in enumerate(['A', 'B', 'C']):
  pass
```
:::

###