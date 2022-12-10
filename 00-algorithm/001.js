var twoSum = function(nums, target) {
    const legs = nums.length;
    for (let i = 0; i < legs; i++) {
        for(let j = i + 1; j < legs; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [-1, -1];
}

const nums = [3,2,4];
const target = 6;

const value = twoSum(nums, target);
console.log(value);
