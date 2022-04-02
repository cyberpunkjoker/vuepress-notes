# encoding: utf-8
from calendar import month
from cgitb import reset
from cmath import log
import math
from pprint import pprint
from this import d
from collections.abc import Iterable
import os, time, random
import functools

import types

from enum import Enum, unique
import logging

import pickle

import json
from multiprocessing import Process, Pool

import subprocess

# x_to_abs = abs(-100) #100
# max_number = max(1,24,-100,239) #239

# # 数据类型转换
# int('123')      # 转整形
# float('12.34')  # 转浮点数
# str(1.23)       # 转字符串
# bool(1)         # 转布尔值

# number = 0.2 + 0.1
# # print(number) # 0.3 => py自带的识别模式，自动识别小数点后面，如若不声明变量类型的话


# # 定义函数
# def my_abs(x):
#   if not isinstance(x, (int, float)):
#     raise TypeError('bad operand type')
#   if x >= 0:
#     return x
#   else:
#     return -x

# # print(my_abs(-877))

# def nop():
#   pass # 空函数 pass

# # 返回多个值
# def move(x, y, step, angle = 0):
#   nx = x + step * math.cos(angle)
#   ny = y - step * math.sin(angle)
#   return nx, ny

# x, y = move(100, 100, 60, math.pi / 6)
# # print(x, y)

# # 一元二次题目练习
# def quadratic(a, b, c):
#   common = b ** 2 - 4 * a * c
#   if not common > 0:
#     raise TypeError('wrong')
#   common_to_sqrt = math.sqrt(common)
#   x1 = (-b + common_to_sqrt) / (2 * a)
#   x2 = (-b - common_to_sqrt) / (2 * a)
#   return x1, x2

# x1, x2 = quadratic(1,3,2)
# # print(x1, x2)

# # 传参 && 可选参数问题
# def calc(*numbers):
#   sum = 0
#   for n in numbers:
#     sum += n
#   return sum

# list = [1,2,3,4,5,56,7]

# print(calc(*list))

# def person(name, age, **kw):
#   # print('name:', name, 'age:', age, 'other:', kw)
#   pass

# # person('jack', 12, city='beijing', job='sb')


# ###### ---------------------------------------------------------- 高级特性 ---------------------------------------------------------- 
# # 切片
# l = [1,2,3,4,5,6]
# # print(l[1:3])
# # print(l[:3])
# # print(l[-3:])
# # print(l[:6:3])

# # 迭代
# d = {'a': 1, 'b': 2, 'c': 3}
# for k, v in d.items():
#   # print(k, v)
#   pass
# # print(isinstance('abc', Iterable))

# print(list(range(1, 11)))

# l_r = [x * x for x in range(1, 11) if x % 2 == 0]
# print(l_r)

# l_e = [x if x % 2 == 0 else -x for x in range(1, 11)]
# print(l_e)

# l_str = [m + n for m in 'ABC' for n in 'XYZ']
# print(l_str)

# l_os = [d for d in os.listdir('.')]   # os.listdir可以列出文件和目录
# print(l_os)


g = (x * x for x in range(10))
# print(next(g))

def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1
    return 'done'

# print(fib(10))


# X = [0] + [1]
# print(X) // [0, 1]

# 杨辉三角形
# def triangles():
#     L = [1]
#     while True:
#         yield L
#         X = [0] + L
#         Y = L + [0]
#         L = [X[i] + Y[i] for i in range(len(X))]
#         print(X, Y, L)


def lazy_sum(*args):
    def sum():
        ax = 0
        for n in args:
            ax = ax + n
        return ax
    return sum

# print(lazy_sum(1,23,4,5)())

# ########## 装饰器 ##########
# def log(text):
#   def decorator(func):
#     @functools.wraps(func)
#     def wrapper(*args, **kw):
#       print(args, kw)
#       print('%s %s():' % (text, func.__name__))
#       if text == 'execute':
#         return (args)
#       return func(*args, **kw)
#     return wrapper
#   return decorator

# @log('execute')
# def now(*arg, **kw):
#   return ('xxx-xxx', arg, kw)

# print(now(1,2,3, ext = None))


# *********** 偏函数
# int2 = functools.partial(int, base = 2)


# class Student(object):
#     __slots__ = ('name', 'age', 'get_info')

# s = Student()

# s.name = 'yahaha'
# s.age = 18

# def get_info(self):
#     return print('name: %s, age: %s' % (self.name, self.age))

# Student.get_info = get_info

# s.get_info()

class Student(object):
    def __init__(self, name):
        self.name = name
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

    def __str__(self):
        return 'Student object (name: %s)' % self.name

    __repr__ = __str__
# s = Student()
# s.score = 600
# print(s.score)

# class Fib(object):
#     def __init__(self):
#         self.a, self.b = 0, 1 # 初始化两个计数器a，b

#     def __iter__(self):
#         return self # 实例本身就是迭代对象，故返回自己

#     def __next__(self):
#         self.a, self.b = self.b, self.a + self.b # 计算下一个值
#         if self.a > 100000: # 退出循环的条件
#             raise StopIteration()
#         return self.a # 返回下一个值
    
#     def __getitem__(self, n):
#         a, b = 1, 1
#         for x in range(n):
#             a, b = b, a + b
#         return a

#     def __getattr__(self, attr):
#         if attr=='score':
#             return 99
# f = Fib()
# for n in f:
#     print(n)

# print('2222', f[4])



# class Chain(object):

#     def __init__(self, path=''):
#         self._path = path

#     def __getattr__(self, path):
#         return Chain('%s/%s' % (self._path, path))

#     def __str__(self):
#         return self._path

#     __repr__ = __str__

# print(Chain().status.user.timeline.list)  # /status/user/timeline/list


# month = Enum('Month', ('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'))

# for name, member in month.__members__.items():
#     print(name, '=>', member, ',', member.value)


# @unique
# class Weekday(Enum):
#     Sun = 0
#     Mon = 1
#     Tue = 2
#     Wed = 3
#     Thu = 4
#     Fri = 5
#     Sat = 6

# print(Weekday.Mon)
# print(Weekday.Mon.value)


# class Hello(object):
#     def hello(self, name="world"):
#         print('Hello, %s' % name)

# print(type(Hello))


def fn(self, name="world"):
    print('Hello, %s' % name)

Hello = type('Hello', (object,), dict(hello=fn))

h = Hello()
# h.hello()


# def foo(s):
#     return 10 / int(s)

# def bar(s):
#     return foo(s) * 2

# def main():
#     try:
#         bar('0')
#     except Exception as e:
#         logging.exception(e)
#         raise
#     finally:
#         print('finally...')

# main()

# s = '0'
# n = int(s)
# logging.basicConfig(
#     level=logging.DEBUG,
#     filename="test.log",
#     datefmt="%Y-%m-%d %H:%M:%S",
#     format="【%(asctime)s %(levelname)s】 %(lineno)d: %(message)s"
# )
# logging.debug("debug")
# print(10 / n)


# ################# 文件的读写
# 自动帮我们调用close()
# with open('/Users/ext.renzhiwei1/test-code/vuePress/docs/PythonNotes/test.txt', 'a') as f:
    # print(f.read(1024))  # 限制读取内容的大小
    # print(f.readline())  # 调用readline()可以每次读取一行内容，调用readlines()一次读取所有内容并按行返回list
    # f.write('write something3333')
    

# print(os.uname())
# print(os.environ)
# print(os.environ.get('PATH'))


# print(os.path.abspath('.')) # 查看当前目录的绝对路径
# os.path.join('a', 'b')   # 合并两个路径

# 序列化
# d = dict(name="Bob", age=10, score=88)
# with open('dump.txt', 'wb') as f:
#     pickle.dump(d, f)
# # 反序列化
# with open('dump.txt', 'rb') as f:
#     d = pickle.load(f)
#     print(d)



# d = {
#     'name': 'dssd',
#     'is_valid': True,
#     'ca': 65.5,
#     'info': {
#         'a': 'wewe',
#         'b': 123
#     }
# }

# rest = json.dumps(d, indent=3)
# print(rest)

# data = json.loads(rest)
# print(data)


print('Process (%s) start...' % os.getpid())
# Only works on Unix/Linux/Mac:
# pid = os.fork()
# if pid == 0:
#     print('I am child process (%s) and my parent is %s.' % (os.getpid(), os.getppid()))
# else:
#     print('I (%s) just created a child process (%s).' % (os.getpid(), pid))


# def long_time_task(name):
#     print('Run task %s (%s)...' % (name, os.getpid()))
#     start = time.time()
#     time.sleep(random.random() * 3)
#     end = time.time()
#     print('Task %s runs %0.2f seconds.' % (name, (end - start)))

# if __name__=='__main__':
#     print('Parent process %s.' % os.getpid())
#     p = Pool(4)
#     for i in range(5):
#         p.apply_async(long_time_task, args=(i,))
#     print('Waiting for all subprocesses done...')
#     p.close()
#     p.join()
#     print('All subprocesses done.')


# print('$ nslookup www.python.org')
# r = subprocess.call(['nslookup', 'www.python.org'])
# print('Exit code:', r)



# print('$ nslookup')
# p = subprocess.Popen(['nslookup'], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
# output, err = p.communicate(b'set q=mx\npython.org\nexit\n')
# print(output.decode('utf-8'))
# print('Exit code:', p.returncode)


import time, threading

# 假定这是你的银行存款:
balance = 0

def change_it(n):
    # 先存后取，结果应该为0:
    global balance
    balance = balance + n
    balance = balance - n

def run_thread(n):
    for i in range(2000000):
        change_it(n)

t1 = threading.Thread(target=run_thread, args=(5,))
t2 = threading.Thread(target=run_thread, args=(8,))
t1.start()
t2.start()
t1.join()
t2.join()
print(balance)