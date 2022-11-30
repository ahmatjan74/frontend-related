## JS模块化
### 1. 不得不说的历史
#### 历史
JS 本身是简单的页面设计：页面动画+表单提交，
并无模块化 or 命名空间的概念

> JS 的模块化需求日益增长

#### 幼年期： 无模块化
1. 开始在页面中增加一些不同的js：动画，表单，格式化等
2. 多种js文件被分在不同的文件中
3. 不同的文件又被同一个模块引用

```js
<script src='jquery.js'></script>
<script src='main.js'></script>
<script src='dep1.js'></script>
//--
```

认可；
文件分离是最基础模块化第一步
问题出现：
* 污染全局作用域 => 不利于大型项目的开发以及多人团队的共建

#### 成长期： 模块化的雏形 - **IIFE**（语法侧的优化）

#### 作用域的把控
例子：
```js
// 定义一个全局变量
let count = 0;
// 模块1
const increase = () => count++;
// 代码块2
const reset = () => {
    count = 0;
}

increase();
reset();
```

利用函数**块级作用域**
```js
(() => {
    let count = 0;
    // ...
})
```
仅定义了一个函数，如果立即执行
```js
(() => {
    let count = 0;
    // ...
})();
```
初始实现了一个最最最简单的模块

尝试去定义一个最简单的模块
```js
const iifeModule = (() => {
    let count = 0;
    return {
        increase: () => ++count;
        reset: () => {
            count = 0;
        }
    }
})();

iifeModule.increase();
iifeModule.reset();
```

**追问：有额外的依赖时，如何优化IIFE相关代码**
> 优化1: 依赖其他模块的IIFE
```js
// 通过传参的方式
const iifeModule = ((
    dependency1, dependency2
    ) => {
    let count = 0;
    return {
        increase: () => ++count;
        reset: () => {
            count = 0;
        }
    }
})(dependency1, dependency2);

iifeModule.increase();
iifeModule.reset();
```
**面试1: 了解早期的jquery的依赖处理以及模块加载方案吗/了解传统IIFE是如何解决依赖问题？**
**答：IIFE加传参调配**

实际上，jquery等框架其实应用的revealing的写法：
解释模式
```js
// 只暴露了借口，而不是整个实现方式
const iifeModule = ((
    dependency1, dependency2
    ) => {
    let count = 0;
    const increase = () => ++count;
    const reset = () => {
        count = 0;
    }
    return {
        increase, reset
    }
})(dependency1, dependency2);

iifeModule.increase();
iifeModule.reset();
```

#### 成熟期：
##### CJS - commonJS

> node.js制定
特征：
* 通过module + exports 去对外暴露接口
* 通过require来调用其他模块


模块组织方式
```js
// 引入部分
const module1 = require(./module1);
const module2 = require(./module2);

// 处理部分
let count = 0;
const increase = () => ++count;
const reset = () => {
    count = 0;
}
// 做一些跟引入模块相关事宜...
module1.test();
module2.test2();
...
// 暴露部分
exports.increase = increase
exports.reset = reset
// 或者
module.exports = {
    increase, reset
}
```

模块的使用方式
```js
const {increase, reset} = require(./main.js);

increase();
reset();
```

**可能被问到的问题**

实际执行处理？？？

```js
(function(thisValue, exports, require, module) {
    const dependencyModule1 = require(./dep1);
    const dependencyModule2 = require(./dep2);

    // 业务逻辑
    ....
}).call(thisValue, exports, require, module)

```

>  优点：
commonJS率先实现在服务端实现了，从框架层面解决依赖，全局变量污染的问题

> 缺点：主要针对服务端的解决方案，对于异步拉取依赖的处理整合的不是很友好

新的问题 -- 异步依赖

#### AMD规范
>  异步加载 + 允许执行回掉函数
经典的框架是 require.js

新增定义方式：
```js
//通过 define 来定义一个模块，然后require来进行加载
/*
    define
    params：模块名，依赖的模块，callback
*/

define(id, [depends], callback)
require([module], callback)
```

模块定义方式
```js   
define('amdModule', ['dep1', 'dep2'], (dep1, dep2) => {
    // 业务逻辑
    ...
    // 处理部分
    let count = 0;
    const increase = () => count ++;
    const reset = () => {
        count = 0;
    }

    return {
        increase, reset
    }
})
```

引入模块：
```js
require(['amdModule'], (amdModule) => {
    amdModule.increase();
    ....
})

```

**面试题2: 如果在AMDModule中想兼容已有代码，怎么办**
```js
define('amdModule', [], (require) => {
    // 引入部分
    const dep1 = require(./dep1)
    const dep2 = require(./dep2)
    ...
    // 处理部分
    let count = 0;
    const increase = () => count ++;
    const reset = () => {
        count = 0;
    }

    return {
        increase, reset
    }
})
```

**面试3: AMD中使用revealing**
```js
define('amdModule', [], (require, export, module)=> {
    // 引入部分
    const dep1 = require(./dep1)
    const dep2 = require(./dep2)
    ...

    // 处理部分
    let count = 0;
    const increase = () => count ++;
    const reset = () => {
        count = 0;
    }

    // 做一些跟引入依赖相关事宜
    export.increase = increase()
    export.reset = reset()
})

define('amdModule', [], (require) => {
    const otherModule = require('amdModule');
    otherModule.increase();
    otherModule.reset();
})
```

**面试题4: 兼容AMD & CJS / 如何判断CJS和AMD**

> UMD的出现

```js
(define('amdModule', [], (require, export, module) => {
    // 引入部分
    const dep1 = require(./dep1)
    const dep2 = require(./dep2)
    ...

    // 处理部分
    let count = 0;
    const increase = () => count ++;
    const reset = () => {
        count = 0;
    }

    // 做一些跟引入依赖相关事宜
    export.increase = increase()
    export.reset = reset()

}))(
    typeof module === 'object' 
    && module.exports 
    && typeof define !== 'function' ?
     // CJS 
     (factory) => module.exports = factory(require, exports, module)
     : // AMD
        define 
)
```

> * 优点：适合在浏览器中异步加载模块

> * 缺点： 会有引入成本，不能按需加载

#### CMD规范








