## 算法笔记

### 递归
<tag name="demo1"/>
下面这道题可以用来好好理解一下递归，一般类似斐波那契计算的递归只有一层递归。这里用了两个，会将两者都运行。

1. 第一次只有`(`忽略。
2. 第二次两个条件都满足，此时会走两个分支 `((` 和  `()`
3. 第三次四种情况，会在上诉两种情况下继续产生满足条件的分支
```js
var generateParenthesis = function(n) {
  const res = []

  const dfs = (left, right, curStr) => {
    if (left === 0 && right === 0) {
      res.push(curStr)
      return
    }

    if (left > 0) {
      dfs(left-1, right, curStr + '(')
    }

    if (right > left) {
      dfs(left, right - 1, curStr + ')')
    }
  }
  dfs(n, n, '')
  return res;
};
```

<tag name="demo2" />
题目：一只青蛙一次可以跳上1级台阶，也可以跳上2级台阶。求该青蛙跳上一个 10 级的台阶总共有多少种跳法。

**使用递归思路解决：**
> - 要想跳到第10级台阶，要么是先跳到第9级，然后再跳1级台阶上去;要么是先跳到第8级，然后一次迈2级台阶上去。
> - 同理，要想跳到第9级台阶，要么是先跳到第8级，然后再跳1级台阶上去;要么是先跳到第7级，然后一次迈2级台阶上去。
> - ......

**由此可得等式：**
> - f(10) = f(9) + f(8)
> - f(9) = f(8) + f(7)
> - ...
> - f(n) = f(n-1) + f(n-2)

**代码展示：**
```js
const numWays = (n) => {
  if (n === 1) return 1
  if (n === 2) return 2
  return numWays(n-1) + numWays(n-2)
}
console.log(numWays(10))
```
上诉为使用递归的思路解决该问题。但是时间复杂度为 O(2^n)，为什么呢？因为它是至上而下的一个树，就拿 `f(7)` 来说它在递归中会计算3次。

所以在此我们可以使用 动态规划进行优化（见下面动态规划）

<tag name="demo3"/>题目：给定一个不含重复数字的数组 nums ，返回其 所有可能的全排列 。你可以 按任意顺序 返回答案。

```js
var permute = function(nums) {
  const res = []
  const dfs = (addArr, remainArr) => {
    if (remainArr.length === 0) {
      return res.push(addArr)
    }
    
    remainArr.forEach(item => {
      const newArr = [...addArr, item]
      dfs(newArr, nums.filter(i => !newArr.includes(i)))
    })
  }
  
  dfs([], nums)

  return res
};
```
上诉方法的问题是：采用了穷举的方法，但是 比如说 `num = [1,2,3]` 在穷举的时候，`1,2,3`, `1,3,2` 这两种排列的第一位是一样的可以，但是上诉算法还是会从头开始便利。当长度大的时候性能的问题就会显现出来。所以这里因该使用**回溯算法**。



### 动态规划
<tag name="demo1" />
同递归demo2，此为动态规划解法。

这道题的原理是什么呢？相比递归它是自底向上的。f(1) = 1, f(2) = 2, f(3) = f(1) + f(2)，因此直接从第三个数开始循环叠加上去就行了。

```js
const numWays = (n) => {
  if (n === 1) return 1
  if (n === 2) return 2

  let a = 1,
      b = 2,
      temp = 0;
  
  for (let i = 3; i <= n ; i++) {
    temp = a + b
    a = b
    b = temp
  }
  return temp
}

console.log(numWays(10))
```

<tag name="demo2" />

```js
var lengthOfLIS = function(nums) {
  const dp = new Array(nums.length).fill(1);
  for (let i = 0; i < nums.length; i ++) {
    // i与i前面的元素比较
    for (let j = 0; j < i; j++) {
      // 找比i小的元素，找到一个，就让当前序列的最长子序列长度加1
      if (nums[i] > nums[j]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }
  // 找出最大的子序列
};
```
### 回溯算法
<tag name="demo1" />
给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。你可以按 任意顺序 返回这些组合。 

[详见](https://leetcode.cn/problems/combination-sum)
```js
// 回溯 ➕ 减枝
var combinationSum = function(candidates, target) {
    const res = []

    const dfs = (nums, startIndex, sum) => {
        if (sum === target) return res.push(nums.slice())
        if (sum > target) return
        
        for (let i = startIndex; i < candidates.length; i++) {
            let temp = candidates[i]
            nums.push(temp)
            dfs(nums, i, sum + temp)
            nums.pop()
        }
    }

    dfs([], 0, 0)

    return res
};
```

<tag name="demo2" />
给定两个整数 n 和 k，返回范围 [1, n] 中所有可能的 k 个数的组合

[详见](https://leetcode.cn/problems/combinations/)
```js
var combine = function(n, k) {
    const res = []
    const dfs = (arr, idx) => {
        if (idx > n + 1) return

        if (arr.length === k) {
            return res.push(arr)
        }

        for (let i = idx; i <= n; i++) {
            dfs([...arr, i], i + 1)
        }
    }

    dfs([], 1)
    return res
};
```
⬆️上面为单纯的递归解法。会有很多重复的分支，对于重复的分支可以，比如[1,2,3] 和 [1,2,4]，两种情况，前面的[1,2]是相同的所以可以在运行完了[1，2，3] 的 情况后，回溯到[1,2]的版本，继续运行，这样就可以减少重复的运算

```js
// 回溯 + 减枝
var combine = function(n, k) {
    const res = []
    const dfs = (arr, idx) => {
        if (arr.length === k) {
            return res.push(arr.slice())
        }
        for (let i = idx; i <= n - (k - arr.length) + 1; i++) { //剪枝（钱少了循环的次数）
            arr.push(i)
            dfs(arr, i + 1)
            arr.pop() //回溯到 push 之前的版本
        }
    }
    dfs([], 1)
    return res
};
```


### 动态规划
<br/>
<tag name="demo1"/>
给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

**这里的分析思路，因该以结束元素为准，而不是以开始元素为准。**
- 如何理解上述的话呢？以 [-2,1,-3,4,-1,2,1,-5,4] 数组为例。
- 正常思路是找到每个元素在所在连续数组的最大值，但是这种具有不确定性。拿-3 为例。在运算中。你并不知道-3之后是否会存在使得数组更大的值。就要考虑到所有的情况。
- 但是换个思路，我从最后一项入手。举个例子，以`-3`结尾的连续数组，情况就明晰了。只有 [-2, 1, -3] 和 [1, -3] 这两种情况。而进一步往前看。以`1`结尾的连续数组只有[-2, 1] 和 [1] 两种，后者包含了前者。

```js
var maxSubArray = function(nums) {
  const dp = new Array(nums.length).fill(0)
  dp[0] = nums[0]

  for (let i = 1; i < nums.length; i++) {
    if (dp[i-1] >= 0) {
      dp[i] = dp[i - 1] + nums[i]
    } else {
      dp[i] = nums[i]
    }
  }

  return Math.max(...dp)
}
```
### 双指标法
<br />
<tag name="demo1" />

```js
// 数组去重 - 双指标法
var removeDuplicates = function(nums) {
  if (nums.length == 0) return 0
  let slow = 0, fast = 1;
  while (fast < nums.length) {
    if (nums[fast] !== nums[slow]) {
      slow ++
      nums[slow] = nums[fast]
    }
    fast++
  }
  return slow + 1
};
removeDuplicates([0,0,1,1,1,2,2,3,3,4])
```

<tag name="demo2"/>

**三数之和为零** [详情](https://leetcode.cn/problems/3sum/)

这是一道非常经典的题，需要注意以下几点
1. 先排序之后再循环就可以做很多减枝的操作，但是排序的耗时会很大（可以考虑哈希存）
2. 固定点为 `nums[i]`, 然后往右边移动按规则查找。
3. 查到符合条件的后，去掉重复的数组，以 L，R 为点左右平移。
```js
 var threeSum = function(nums) {
  const arr = []
  const sortArr = nums.sort((a, b) => a - b)
  const len = sortArr.length

  for(let i = 0; i < len - 1; i++) {
      if (nums[i] > 0) continue
      if (i > 0 && nums[i] === nums[i-1]) continue
      let L = i + 1
      let R = len - 1
      while (L < R) {
          const sum = nums[i] + nums[L] + nums[R]
          if (sum === 0) {
              arr.push([nums[i], nums[L], nums[R]])
              while (L < R && nums[L] === nums[L+1]) L++
              while (L < R && nums[R] === nums[R-1]) R--
              L++
              R--
          }

          if (sum > 0) R--
          if (sum < 0) L++
      }
  }

  return arr
};
  threeSum([-1,0,1,2,-1,-4])
```

### 算法code记录
```js


// 二分法
var searchInsert = function(nums, target) {
  const len = nums.length
  let left = 0, right = len - 1, ans = len;
  while (left <= right) {
    const mid = ((right - left)>>1) + left
    if (target<= nums[mid]) {
      ans = mid
      right = mid - 1
    } else {
      left = mid + 1
    }
  }
  return ans
};
searchInsert([1,3,5,6], 5)
```