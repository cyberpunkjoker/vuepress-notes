l = [1,2,3,4,5,6,7,8,9]

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

print(findMinAndMax(l))