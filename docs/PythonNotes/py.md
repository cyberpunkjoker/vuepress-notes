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
```python
class Student(object):
    pass

bart = Student() # <__main__.Student object at xxxxxx> 指向实例
print(bart)      # <class '__main__.Student'> 类

```
`__init__`: 特殊方法，在创建实例的时候，就把属性值绑上去。

- __init__方法的第一个参数永远是self，表示创建的实例本身
- __init__方法，在创建实例的时候，就不能传入空的参数了

私有变量： => py中前面加有`__`的为私有变量，如：`__name`。

```python
class Student(object):
    def __init__(self, name, score):
        self.__name = name
        self.__score = score

    def get_grade(self):
        if self.__score >= 90:
            return 'A'
        elif self.__score >= 60:
            return 'B'
        else:
            return 'C'
    
    def print_score(self):
        print('%s: %s' % (self.__name, self.__score))

    # 获取私有变量的方法
    def get_private(self, name):
        d = {
            'name': self.__name,
            'score': self.__score
        }
        return d[name]

bart = Student('hahaha', 45)
```


继承与多态：

- 继承：子类可以继承父类的方法
- 多态：同时子类父类存在相同的方法时，子类方法可以覆盖父类

判断方法可用 `isinstance(dog, Animal)` 判断

对于一个变量，我们只需要知道它是Animal类型，无需确切地知道它的子类型，就可以放心地调用run()方法

继承可以把父类的所有功能都直接拿过来，这样就不必重零做起，子类只需要新增自己特有的方法，也可以把父类不适合的方法覆盖重写。
```python
class Animal(object):
    def run(self):
        print('Animal is running...')

class Dog(Animal):
    def run(self):
        print('Dog is running...')

dog = Dog()
dog.run()
```

#### 类型判断
1. 使用 type 判断：
```python
# 基本类型
type(123)==int
type('abc')==str

# 函数类型
import types
def fn():
  pass
type(fn) == types.FunctionType
type(abs)==types.BuiltinFunctionType
type(lambda x: x)==types.LambdaType
type((x for x in range(10)))==types.GeneratorType
```
2. 使用 isinstance 判断：

如何获取一个对象的所有属性和方法 ———— `dir()`
```python
# 测试该对象的属性
# ## 也可以获得对象的方法
setattr(obj, 'y', 19)       # 设置一个属性'y'
hasattr(obj, 'y')           # 有属性'y'吗？
getattr(obj, 'y', 404)      # 获取属性'y', 没有返回 404 默认值
```

#### __slots__
1. python 中可以给实例绑定方法：
```python
from types import MethodType
s.set_age = MethodType(set_age, s) # 给实例绑定一个方法
```
2. 也可以直接给class 绑定方法
```python
Student.set_score = set_score
```
3. 同样也可以限制实例的属性
注：若子类中也定义__slots__，子类实例允许定义的属性就是自身的__slots__加上父类的__slots__
```python
class Student(object):
    __slots__ = ('name', 'age', 'get_info')
s = Student()

s.name = 'yahaha'
s.age = 18

def get_info(self):
    return print('name: %s, age: %s' % (self.name, self.age))

Student.get_info = get_info

s.get_info()  # name: yahaha, age: 18
s.score = 110 # 报错：'Student' object has no attribute 'score'
```
4. 简化类中的 set && get 操作
```python
class Student(object):
    @property
    def score(self):
        return self._score

    @score.setter
    def score(self, value):
        if not isinstance(value, int):
            raise ValueError('score must be an integer!')
        if value < 0 or value > 100:
            raise ValueError('score must between 0 ~ 100!')
        self._score = value
s = Student()
s.score = 600
print(s.score)
```
5. 多重继承
```python
# MixIn
class Bat(Mammal, Flyable):
    pass
```
6. 定制类
- `__str__`: 自定义打印值
- `__repr__`: 同上
- `__iter__` && `__next__` && `__getitem__`: 使类可用for ... in循环，next 拿到循环的下一个值，getitem 像list一样获取某一项的值（手动实现）
- `__getattr__`: 尝试获得属性, 只有在没有找到属性的情况下，才调用__getattr__，已有的属性，不会在
__getattr__中查找。
- `__call__`: 直接对实例进行调用===>s() ,也可用callable()判断是否可调。
```python
class Fib(object):
    def __init__(self):
        self.a, self.b = 0, 1 # 初始化两个计数器a，b

    def __iter__(self):
        return self # 实例本身就是迭代对象，故返回自己

    def __next__(self):
        self.a, self.b = self.b, self.a + self.b # 计算下一个值
        if self.a > 100000: # 退出循环的条件
            raise StopIteration()
        return self.a # 返回下一个值
    
    def __getitem__(self, n):
        a, b = 1, 1
        for x in range(n):
            a, b = b, a + b
        return a

    def __getattr__(self, attr):
        if attr=='score':
            return 99

    def __call__(self):
        print('My name is %s.' % self.name)

f = Fib()
f()
for n in f:
    print(n)
```

**`__getattr__`: 还可以用来链式调用**
可以用来链式调用 API
```python
class Chain(object):

    def __init__(self, path=''):
        self._path = path

    def __getattr__(self, path):
        return Chain('%s/%s' % (self._path, path))

    def __str__(self):
        return self._path

    __repr__ = __str__

print(Chain().status.user.timeline.list)  # /status/user/timeline/list
```

#### 枚举
两种方式：
```python
# 1.
month = Enum('Month', ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'))
# 2.
@unique  # 用来确定唯一性
class Weekday(Enum):
    Sun = 0
    Mon = 1
    Tue = 2
    Wed = 3
    Thu = 4
    Fri = 5
    Sat = 6
```
#### 元类
**动态创建类**
```python
Hello = type('Hello', (object,), dict(hello=fn))
```
参数如下：
1. class的名称；
2. 继承的父类集合，注意Python支持多重继承，如果只有一个父类，别忘了tuple的单元素写法；
3. class的方法名称与函数绑定，这里我们把函数fn绑定到方法名hello上。

**metaclass**

### 错误处理
[错误类型](https://docs.python.org/3/library/exceptions.html#exception-hierarchy)

抛错，不需要在每个可能出错的地方去捕获错误，只要在合适的层次去捕获错误就可以了
如下： ⬇️
```python
import logging

def foo(s):
    return 10 / int(s)

def bar(s):
    return foo(s) * 2

def main():
    try:
        bar('0')
    except Exception as e:
       logging.exception(e)
        raise
    finally:
        print('finally...')
```

#### 调试
1. 断言
`assert n != 0, 'n is zero!'`: 表达式n != 0应该是True，否则，根据程序运行的逻辑，后面的代码肯定会出错。(则打印出后面的信息)
2. logging
将错误信息打印到txt文本中
```python
import logging

s = '0'
n = int(s)
logging.basicConfig(
    level=logging.DEBUG,
    filename="test.log",
    datefmt="%Y-%m-%d %H:%M:%S",
    format="【%(asctime)s %(levelname)s】 %(lineno)d: %(message)s"
)
logging.debug("debug")
logging.info("info")
logging.warning("warning")
logging.error("error")
print(10 / n)
```

**编写测试单元**（先略）

**文档测试**


## IO编程
1. 读文件
```python
# 自动帮我们调用close()
with open('xxxx路径', 'r') as f:
    # print(f.read(1024))  # 限制读取内容的大小
    # print(f.readline())  # 调用readline()可以每次读取一行内容，调用readlines()一次读取所有内容并按行返回list
```
read 方法返回的对象，称为 => file-like Object。
- 二进制文件， open('xxx', 'rb')
- 字符编码，open('xxx', 'r', encoding='gbk', errors='ignore')
 - errors='ignore': 忽略错误编码

2. 写文件
```python
with open('/Users/michael/test.txt', 'w') as f:
    f.write('Hello, world!')
```
传入值为`w`, 会覆盖已有文件，传入值若为 `a`, 则是在文件后面继续添加

#### StringIO和BytesIO
很多时候，数据读写不一定是文件，也可以在内存中读写。
```python
from io import StringIO, BytesIO
f = StringIO()
f.write('hello')

f2 = BytesIO()
f2.write('中文'.encode('utf-8'))


# os一点相关的内容
os.uname()
os.environ
os.environ.get('PATH')

#### 这两个有用
os.path.abspath('.')    # 查看当前目录的绝对路径
os.path.join('a', 'b')   # 合并两个路径
```

#### 序列化
我们把变量从内存中变成可存储或传输的过程称之为序列化

把变量内容从序列化的对象重新读到内存里称之为反序列化
```python
# 序列化
d = dict(name="Bob", age=10, score=88)
with open('dump.txt', 'wb') as f:
    pickle.dump(d, f)
# 反序列化
with open('dump.txt', 'rb') as f:
    d = pickle.load(f)
```
JSON 转化
```python
d = {
    'name': 'dssd',
    'is_valid': True,
    'ca': 65.5,
    'info': {
        'a': 'wewe',
        'b': 123
    }
}
rest = json.dumps(d, indent=3)
data = json.loads(rest)
```

### 进程和线程
一个进程中可以有多个线程，它们共享这个进程的资源

#### 多进程

fork(): 适用于Unix/Linux操作系统
兼容 windows => `multiprocessing`:

创建子进程
Pool
同时运行的 进程个数是根据cup 核数来的。

子进程的输入输出：
输出：
subprocess.call(['nslookup', 'www.python.org'])

输入：
p = subprocess.Popen(['nslookup'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
p.communicate(b'set q=mx\npython.org\nexit\n')

进程之间的通信：



在Unix/Linux下，可以使用fork()调用实现多进程。

要实现跨平台的多进程，可以使用multiprocessing模块。

进程间通信是通过Queue、Pipes等实现的。






#### 多线程
Python的threading模块有个current_thread()函数，它永远返回当前线程的实例

多线程和多进程最大的不同在于，多进程中，同一个变量，各自有一份拷贝存在于每个进程中，互不影响，而多线程中，所有变量都由所有线程共享，所以，任何一个变量都可以被任何一个线程修改，因此，线程之间共享数据最大的危险在于多个线程同时改一个变量，把内容给改乱了。



## python 遗留问题
TODO：
1. py 项目如何包管理
2. py 如何导入自己的其它模块