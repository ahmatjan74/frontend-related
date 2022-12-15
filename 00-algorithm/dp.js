// 动态规划 - 走一步看一步

// F(0) = 0, F(1) = 1, F(3) = 1, F(4) = 2, ……, F(n) = F(n-1) + F(n-2) 其中n>1
// 实现当前算法求和

// 1. 找到落脚点
// 2. 通过落脚点之外的内容，找到关联
// 3. 关联统一递归or循环

const fib = function(n) {
    if (n < 2) {
        return n;
    }

    let pre = 0;
    let next = 0;
    let result = 1;

    for(let i = 2; i <= n; i++) {
        pre = next;
        next = result;
        result = pre + next;
    }

    return result;
}