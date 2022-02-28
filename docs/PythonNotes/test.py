# encoding: utf-8
from cmath import log
import math
from this import d
from collections.abc import Iterable
import os
import functools

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

print(lazy_sum(1,23,4,5)())

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
int2 = functools.partial(int, base = 2)