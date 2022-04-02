## code记录
### 阶段一：
—— 通过一些简单的算法题来巩固 py 的基础语法：
**返回（除本身和1）所有因数**
```py
import math
def divisors(integer):
  return [i for i in range(2, math.ceil(integer / 2 + 1)) if not integer % i] or '%d is prime' % integer
```

**[行走判断](https://www.codewars.com/kata/54da539698b8a2ad76000228/solutions/python)**
```py
def is_valid_walk(walk):
  return len(walk) == 10 and walk.count('n') == walk.count('s') and walk.count('e') == walk.count('w')
```

**[质数个数](https://www.codewars.com/kata/54d512e62a5e54c96200019e/train/python)**
```py
# 质数判断
def is_prime(n):
  for i in range(2, math.ceil( n // 2 + 1)):
    if (n % i == 0):
      return False
  return True

def next_prime(n):
  count = n + 1
  while(not is_prime(count)):
    count += 1
  return count

def prime_factors(n):
  prime_list = []
  count = 2   # 质因数
  factor = n  # 剩余数
  str_prime = ''
  while(not is_prime(factor)):
    if (factor % count == 0):
      prime_list.append(count)
      factor /= count
    else:
      count = next_prime(count)
  
  prime_list.append(int(factor))
  unique_list = sorted(set(prime_list))

  for i in unique_list:
    sum = prime_list.count(i) > 1 and ('**' + str(prime_list.count(i))) or ''
    str_prime += '({}{})'.format(i, sum)

  return str_prime
```


:::tips 
- py中的 reduce 和js不一样，因为它没法定义初始值，因此不适合像js一样利用dict做搜集处理
- py中使用二进制的方法`int('1111', 2)`
- 字符串拼接可以使用`format`方法，使用手感和js的模版字符串很像
:::
