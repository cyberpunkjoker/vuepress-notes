## 一些代表性算法记录

```js
// 数组去重 - 双指标法
var removeDuplicates = function(nums) {
  if (nums.length == 0) return 0
  let slow = 0, fast = 1;
  while (fast < nums.lenght) {
    if (nums[fast] !== nums[slow]) {
      slow ++
      nums[slow] = nums[fast]
    }
    fast++
  }
  return slow + 1
};
removeDuplicates([0,0,1,1,1,2,2,3,3,4])

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

#### 分治法
题目：'()'表示1分，()()表示为1+1，'(())'表示为1*2

开始找到最外层的（）。然后次外层的（），找到后去去除最外层（），使用递归。
```js
const scoreOfParentheses = function(s) {
  if (s.length === 2) return 1
  
  let bal = 0, 
      len = s.length, 
      count = 0;
      
  for (let i = 0; i < len; i++) {
    bal += (s[i] === ')' ? -1 : 1)
    if (bal === 0) {
      count = i + 1
      break;
    }
  }
  if (count === len) { // 1*2的分支
    return 2 * scoreOfParentheses(s.slice(1, len-1))
  } else { // 1+1的分支
    return scoreOfParentheses(s.slice(0, count)) + scoreOfParentheses(s.slice(count))
  }
  
};

console.log(scoreOfParentheses('((()())(()))'))
```