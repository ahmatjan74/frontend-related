

### 最近面试题
#### 1. 克里化: 将多个参数的一个函数，转换成单个参数的函数
```js

const add = (x) => {
    return function(y) {
        return x + y;
    }
}

const add1 = add(1)
const add2 = add(2);
add1(2)
add2(4);
```
compose
```js

const filterBoolean = arr => arr.filter(Boolean);
const filterBigger = num => arr => arr.filter(item => item <= num);
const filerBigger10 = filterBigger(10);

const multiply = num => arr => arr.map(item => item * num);
const multiplyTwo = multiply(2);

const compose = (...rest) => startNum => rest.reduce((total, item) => item(total),startNum);

const modifyArr2 = compose(filterBoolean, multiplyTwo, filerBigger10);

let arr = [0,1,2,3,4,5,6];
console.log(modifyArr2(arr));
```

#### 2. gulp, rollup 和webpack的比较

- webpack	
> 一种前端资源模块化管理和打包工具。它可以将许多松散的模块按照依赖和规则打包成符合生产环境部署的前端资源。还可以将按需加载的模块进行代码分割，等到实际需要的时候再异步加载
>

> 优点
    - 模块化、静态资源整合、公共代码拆分、异步加载、热更新等等
- 缺点
  1. 配置复杂
  2. 冗余代码较多
  3. 不支持输出esm格式的bundle
   
-  应用场景
应用程序开发

  
- rollup
> 一个模块打包工具, 可以将我们按照 ESM (ES2015 Module) 规范编写的源码构建输出如下格式:
- iife: 自执行函数, 可通过 <script> 标签加载
- amd: 通过 RequireJS 加载
- cjs: Node 默认的模块规范, 可通过 Webpack 加载
- umd: 兼容 IIFE, AMD, CJS 三种模块规范
- esm: ES2015 Module 规范, 可用 Webpack, Rollup 加载

> 优点
1. 基于ES6，支持动态导入、tree shaking
2. 可以将所有小文件打到一个bundle里，所有代码都在同一个函数作用域中，不压缩混淆的情况下代码依旧可读
3. 冗余代码少，执行快

> 缺点
1. 不支持热更新（可以通过livereload插件实现）
2. 对于commonjs模块，需要用rollup-plugin-commonjs插件读成ES6代码后再处理
3. umd和iife格式无法对公共代码进行拆分，因为自执行函数会把所有的模块都放到一个函数中，并没有像webpack一样有一些引导代码，所以没有办法做到代码拆分

> 应用场景
框架、组件库、生成单一umd文件的场景

- gulp	
> 借鉴了Unix操作系统的管道（pipe）思想，前一级的输出，直接变成后一级的输入，使得在操作上非常简单，基于流式操作，通过各种 Transform Stream 来实现文件不断处理 输出	
>

> 优点
1. 文档简单，学习成本低
2. 借助插件，可以对大量源文件进行流式处理，可以对文件类型进行多种操作处理

> 缺点
1. 不支持tree shaking、热更新、公共代码拆分
2. 无法进行js模块化，只是对静态资源进行流式处理和整合

> 应用场景
静态资源密集型场景，如css、img等静态资源整合


#### 3. package.lock.json文件的作用
锁定安装时的包的版本号及包的依赖的版本号, 以保证其他所有人人在使用 ​​npm install​​ 时下载的依赖包都是一致的


#### 4. npm和yarn的区别

#### 5. treeShaking
> 为了减少最终构建体积而诞生。
> 
> tree-shaking 是一个通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code) 行为的术语。
>
> 它依赖于 ES2015 中的 import 和 export 语句，用来检测代码模块是否被导出、导入，且被 JavaScript 文件使用。
>
> 在现代 JavaScript 应用程序中，我们使用模块打包(如 webpack 或 Rollup)将多个 JavaScript 文件打包为单个文件时自动删除未引用的代码。这对于准备预备发布代码的工作非常重要，这样可以使最终文件具有简洁的结构和最小化大小
>
- tree-shaking VS dead code elimination
> 说起 tree-shaking 不得不说起 dead code elimination，简称 DCE
>
> 简单来说：DCE 好比做蛋糕时，直接放入整个鸡蛋，做完时再从蛋糕中取出蛋壳。而 tree-shaking 则是先取出蛋壳，在进行做蛋糕。两者结果相同，但是过程是完全不同的。
>
- dead code

dead code 一般具有以下几个特征:
- 代码不会被执行，不可到达
- 代码执行的结果不会被用到
- 代码只会影响死变量（只写不读）

使用 webpack 在 mode: development 模式下对以下代码进行打包：
```js
function app() {
    var test = '我是app';
    function set() {
        return 1;
    }
    return test;
    test = '无法执行';
    return test;
}

export default app;
```
最终打包结果:
```js
eval(
    "function app() {\n    var test = '我是app';\n    function set() {\n        return 1;\n    }\n    return test;\n    test = '无法执行';\n    return test;\n}\n\napp();\n\n\n//# sourceURL=webpack://webpack/./src/main.js?"
);
```
可以看到打包的结果内，还是存在无法执行到的代码块。
webpack 不支持 dead code elimination 吗？是的，webpack 不支持。

原来，在 webpack 中实现 dead code elimination 功能并不是 webpack 本身, 而是大名鼎鼎的 uglify。
   
通过阅读源码发现，在 mode: development 模式下，不会加载 terser-webpack-plugin 插件。

而 terser-webpack-plugin 插件内部使用了 uglify 实现的。

- tree shaking 无效
  
tree shaking 本质上是通过分析静态的 ES 模块，来剔除未使用代码的。

> _ESModule__ 的特点_

> 只能作为模块顶层的语句出现，不能出现在 function 里面或是 if 里面。（ECMA-262 15.2) import 的模块名只能是字符串常量。(ECMA-262 15.2.2) 不管 import 的语句出现的位置在哪里，在模块初始化的时候所有的 import 都必须已经导入完成。(ECMA-262 15.2.1.16.4 - 8.a) import binding 是 immutable 的，类似 const。比如说你不能 import { a } from ‘./a’ 然后给 a 赋值个其他什么东西。(ECMA-262 15.2.1.16.4 - 12.c.3) —–引用自尤雨溪
>
我们来看看 tree shaking 的功效。
```js
// ./src/app.js
export const firstName = 'firstName'

export function getName ( x ) {
    return x.a
}

getName({ a: 123 })

export function app ( x ) {
    return x * x * x;
}

export default app;

// export function main() {
//     var test = '我是index';
//     let methodName = 'square'
//     App[methodName](1)
//     return test;
// }
```

使用 最简单的webpack配置进行打包

```js
// webpack.config.js
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'dist.js'
    },
    mode: 'production'
};
```

通过结果可以看到，对死代码进行了消除，只有第 7 种，消除失败。

引用： https://zhuanlan.zhihu.com/p/529044034


1. monorepo是什么？


