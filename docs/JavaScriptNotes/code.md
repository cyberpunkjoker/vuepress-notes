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