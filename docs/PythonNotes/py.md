## python 学习
#### 基础类型
**整数：**

**字符串：**
字符串特殊处理：转译字符=>`\` 'I\'m \"OK\"'

方法：
- 获取字符的整数表示（`ord()`）
- 编码转换成对应的字符（`chr()`）
- 把 bytes 变成 str（`decode()`）
- 字符串长度（`len()`）
- - 当出现中文时：(需要指明编码方式)
```py
len('中午'.encode('utf-8'))
```
- 占位符
- Python对 bytes 类型的数据用带 b 前缀的单引号或双引号表示

**布尔值：**
两个值： True || False

运算方式：`与运算:and`、`或运算:or`、`非运算:(not)单目运算True=>False,False=>True`

**空值：**
None

**List**
- 追加元素到末尾 - append()
- 插入元素到指定位置 - insert(idx, elm)
- 删除末尾元素 - pop(idx) 传入索引删除对应索引元素

```python
userList = ['a', 'b', 'c']
last = userList[-1]
print(last)

userList.append('ddd')
userList.insert(1, 'jack')
userList.pop(0)
print(userList)
```

**tuple**
元组，初始化后不可修改（引用对象可修改）

**dict**
在其它语言中也称为 map
```python
d = { 
    'name': 'king', 
    'age': 18, 
    'gender': 'male',
}
if 'name' in d:
    print(d['name'])
print('key不存在则返回为 Null', d.get('nam'))
```
**set**
一组key的集合，但不储存value，因为key不能重复，所以在set中没有重复的key
- add(key) 添加
- remove(key) 删除

和js的差别之一是： set结构中不支持，List 和 Dict 结构

#### 计算
取整：`//`
取余：`%`

输入：input()
输出：print()


#### 条件判断
```python
user_heiht = 1.75
user_weight = 80.5

bmi_params = user_weight / ( user_heiht * user_heiht )
print(bmi_params)
if bmi_params < 18.5:
    print('过轻')
elif bmi_params < 25:
    print('正常')
elif bmi_params < 32:
    print('过重')
else:
    print('严重')
```

#### 循环
range(): 生成整数序列
break: 跳出循环
continue: 跳出本次循环，进入下次循环
```python
for values in range(101):
    print(values)

# while 循环
sum = 0
n = 99
while n > 0:
    sum += n
    n = n-2
print(sum)
```



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
Iterable: 
- 一类是集合数据类型，如list、tuple、dict、set、str等；
- 一类是generator，包括生成器和带yield的generator function。

生成器都是Iterator对象，但list、dict、str虽然是Iterable，却不是Iterator。
可以使用iter()  => `iter([])` 变成 Iterator

原因： 
1. Python的Iterator对象表示的是一个数据流，Iterator对象可以被next()函数调用并不断返回下一个数据，直到没有数据时抛出StopIteration错误。
2. Iterator甚至可以表示一个无限大的数据流，例如全体自然数。而使用list是永远不可能存储全体自然数的。

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

### 列表生成式

```python
l_r = [x * x for x in range(1, 11) if x % 2 == 0]
  # 结果：[4, 16, 36, 64, 100]

l_e = [x if x % 2 == 0 else -x for x in range(1, 11)]
  # 结果：[-1, 2, -3, 4, -5, 6, -7, 8, -9, 10]

l_str = [m + n for m in 'ABC' for n in 'XYZ']
  # 结果：['AX', 'AY', 'AZ', 'BX', 'BY', 'BZ', 'CX', 'CY', 'CZ']

l_os = [d for d in os.listdir('.')]   # os.listdir可以列出文件和目录
  # 结果：['node_modules', 'docs', '.gitignore', 'package-lock.json', 'package.json', '.git']
```

### 生成器
`yield`: 关键字处暂停 抛出，类似与js
 
 Demo：使用 generator 实现杨辉三角形
 ```python
 # 错位相加前后补0 -> 实现
 def triangles():
    L = [1]
    while True:
        yield L
        X = [0] + L
        Y = L + [0]
        L = [X[i] + Y[i] for i in range(len(X))]
        print(X, Y, L)
 ```
 
## 函数式编程

### 高阶函数
- map & reduce:

`map(fn, Iterator)`: 返回值是一个惰性序列，通过list()把整个序列计算出来返回一个list。

`reduce(fn, Iterator)`: 类似js reduce, 返回累加结果。
```python
l_str = list(map(int, ['1','2','3',4,5,6]))   # 结果：[1,2,3,4,5,6,]

def add(x, y):
    return x + y
sum = reduce(add, [1,2,3,4,5,6,7])   # 结果：28
```

- filter: 筛选过滤，返回 Iterator
- sorted: 排序，可自定义 
  - `sort([], key=fn, reverse=True)` key：自定义规则函数，reverse：反向排序。

#### 返回函数
返回值也可是个函数：

类似与 js ，
返回闭包时牢记一点：返回函数不要引用任何循环变量，或者后续会发生变化的变量。

闭包，就是内层函数引用了外层函数的局部变量。如果只是读外层变量的值。
如果对外层变量赋值，由于Python解释器会把x当作函数fn()的局部变量，就会报错。

#### 匿名函数
关键字： lambda => lambda x: x * x

#### 装饰器
可以在不改变原有的函数体的基础下，增加新的逻辑进去。如下：⬇️
```python
def log(text):                     # 装饰器的传参
  def decorator(func):
    @functools.wraps(func)         # 需要把原始函数的__name__等属性复制到wrapper()函数中
    def wrapper(*args, **kw):
      print('%s %s():' % (text, func.__name__))
      if text == 'execute': 
        return (args)              # 满足该条件则走这里抛出
      return func(*args, **kw)     # 也可以在这里完成对参数的筛选功能
    return wrapper
  return decorator

@log('execute')
def now(*arg, **kw):
  return ('xxx-xxx', arg, kw)

print(now(1,2,3, ext = None))
```
 #### 偏函数
固定传入的参数，感觉就是做了一个闭包 `int2 = functools.partial(int, base = 2)` 


### 模块
作用域: 
- 类似`_xxx`和`__xxx`这样的函数或变量就是非公开的（private）
- 类似`__xxx__`这样的变量是特殊变量，可以被直接引用，但是有特殊用途

第三方包安装
pip 安装第三方包


### 面向对象编程