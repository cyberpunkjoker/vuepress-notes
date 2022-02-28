from functools import reduce
import functools


l = [1,2,3,4,5,6,7,8,9]
# 找最大最小值
def findMinAndMax(l):
  l_len = len(l)
  if l_len == 0:
    return (None, None)
  max_num = l[0]
  min_mun = l[0]
  for k in l:
    if (k > max_num):
      max_num = k
    if (k < min_mun):
      min_mun = k
  return (min_mun, max_num)

# print(findMinAndMax(l))


# 杨辉三角形
def triangles():
    L = [1]
    while True:
        yield L
        X = [0] + L
        Y = L + [0]
        L = [X[i] + Y[i] for i in range(len(X))]
        print(X, Y, L)

# 首字母大写 map()
def to_lower(str):
  return str[0].upper() + str[1:].lower()

def normalize(name):
  return map(to_lower, name)

# print(list(normalize(['adam', 'LISA', 'barT'])))

# 求乘积
def to_prod(x, y):
  return x * y

def prod(l):
  return reduce(to_prod, l)
  
# print(prod(l))

