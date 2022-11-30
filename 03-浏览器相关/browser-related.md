## 常见浏览器 JS 对象常见  API 及用法

https://segmentfault.com/a/1190000014212576

### 什么是浏览器对象模型
BOM ：Browser Object Model（浏览器对象模型）,浏览器模型提供了独立于内容的、可以与浏览器窗口进行滑动的对象结构，就是浏览器提供的 API
其主要对象有：
1. window 对象——BOM 的核心，是 js 访问浏览器的接口，也是 ES 规定的 Global 对象
2. location 对象：提供当前窗口中的加载的文档有关的信息和一些导航功能。既是 window 对象属 性，也是 document 的对象属性
3. navigation 对象：获取浏览器的系统信息
4. screen 对象：用来表示浏览器窗口外部的显示器的信息等
5. history 对象：保存用户上网的历史信息


### Window 对象
windows 对象是整个浏览器对象模型的核心，其扮演着既是接口又是全局对象的角色

```js
alert()	
confirm()
prompt()
open()	
onerror()
setTimeout()
setInterval()
```

- 窗口位置

```js
screenLeft, 
screenTop, 
screenX, 
screenY, 
moveBy(x,y), 
moveTo(x,y)
```

- 窗口大小

```js
innerWidth
innerHeight	

outerWidth
outerHeight	

resizeTo(width, height)
resizeBy(width, height)
```

- 定时器

setTimeout
```js
setTimeout(() => {
    // 100毫秒之后执行
}, 100)
```
setInterval
```js
setInterval(() => {
    // 每间隔100毫秒执行一次
}, 100)
```

### Location 对象
提供当前窗口中的加载的文档有关的信息和一些导航功能。既是 window 对象属性，也是 document 的对象属性

```js
location 对象的主要属性：
hash
host
hostname
href
pathname
port
protocol
search
```

### Navigation 对象
navigation 接口表示用户代理的状态和标识，允许脚本查询它和注册自己进行一些活动


### History 对象
history 对象保存着用户上网的历史记录，从窗口被打开的那一刻算起，history 对象是用窗口的浏览历史用文档和文档状态列表的形式表示。

```js
go() 
back() -> go(-1)
forword() -> go(1)
length
```




## 详解浏览器事件捕获，冒泡

浏览器事件模型中的过程主要分为三个阶段：捕获阶段、目标阶段、冒泡阶段。
这里先看一下这张经典的图

### 第三个参数

这里要注意addEventListener的第三个参数, 如果为true，就是代表在**捕获阶段**执行。如果为false，就是在**冒泡阶段**进行
空口这么说可能不好理解，咱们来看一下代码。
```js
const parent = document.getElementById("parent");
const child = document.getElementById("child");
const son = document.getElementById("son");
// const baidu = document.getElementById("a-baidu");

// baidu.addEventListener('click', function (e) {
//     e.preventDefault();
// })

window.addEventListener("click", function (e) {
    // e.target.nodeName 指当前点击的元素, e.currentTarget.nodeName绑定监听事件的元素
    console.log("window 捕获", e.target.nodeName, e.currentTarget.nodeName);
}, true);

parent.addEventListener("click", function (e) {
    // e.stopPropagation();

    // e.target.nodeName 指当前点击的元素, e.currentTarget.nodeName绑定监听事件的元素
    console.log("parent 捕获", e.target.nodeName, e.currentTarget.nodeName);
}, true);

child.addEventListener("click", function (e) {
    console.log("child 捕获", e.target.nodeName, e.currentTarget.nodeName);
}, true);

son.addEventListener("click", function (e) {
    console.log("son 捕获", e.target.nodeName, e.currentTarget.nodeName);
}, true);

window.addEventListener("click", function (e) {
    // e.target.nodeName 指当前点击的元素, e.currentTarget.nodeName绑定监听事件的元素
    console.log("window 冒泡", e.target.nodeName, e.currentTarget.nodeName);
}, false);

parent.addEventListener("click", function (e) {
    console.log("parent 冒泡", e.target.nodeName, e.currentTarget.nodeName);
}, false);

child.addEventListener("click", function (e) {
    console.log("child 冒泡", e.target.nodeName, e.currentTarget.nodeName);
}, false);

son.addEventListener("click", function (e) {
    console.log("son 冒泡", e.target.nodeName, e.currentTarget.nodeName);
}, false);
```

### 阻止**事件传播**
- e.stopPropagation()

大家经常听到的可能是阻止冒泡，实际上这个方法**不只能阻止冒泡，还能阻止捕获阶段的传播**。

- stopImmediatePropagation() 
如果有多个相同类型事件的事件监听函数绑定到同一个元素，当该类型的事件触发时，它们会按照被添加的顺序执行。如果其中某个监听函数执行了 event.stopImmediatePropagation() 方法，则当前元素剩下的监听函数将不会被执行。

看一下代码

### 阻止默认行为

e.preventDefault()

e.preventDefault()可以阻止事件的**默认行为**发生，默认行为是指：点击a标签就转跳到其他页面、拖拽一个图片到浏览器会自动打开、点击表单的提交按钮会提交表单等等，因为有的时候我们并不希望发生这些事情，所以需要阻止默认行为

### 兼容性

attachEvent——兼容：IE7、IE8； 不支持第三个参数来控制在哪个阶段发生，默认是绑定在冒泡阶段
addEventListener——兼容：firefox、chrome、IE、safari、opera；


# 绑定事件的运用，以及封装一个多浏览器兼容的绑定事件函数

大家常见的一个面试题可能是ul + li，点击每个li alert对应的索引，这里就给大家来写一下看看

- 先来给每个li绑定事件

- 再来写一个事件委托的方式

```js
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
    <ul id="ul">
        <li>1</li>
        <li>2</li>
        <li>3</li>
    </ul>
</body>
```
```js
<script type="text/javascript">
    // 
    const ul = document.querySelector("ul");
    ul.addEventListener('click', function (e) {
        const target = e.target;
    　　if (target.tagName.toLowerCase() === "li") {
    　　　　const liList = this.querySelectorAll("li");
            // index = Array.from(liList)
    　　　　index = Array.prototype.indexOf.call(liList, target);
    　　　　alert(`内容为${target.innerHTML}, 索引为${index}`);
    　　}
    })
    

    // 事件委托的方式: 孩子的事件绑定到父节点
    const liList = document.getElementsByTagName("li");
    for(let i = 0; i<liList.length; i++){
        liList[i].addEventListener('click', function(e){
            alert(`内容为${e.target.innerHTML}, 索引为${i}`);
    　　 })
    }
</script>
</html>
```


### 封装一个多浏览器兼容的绑定事件函数
```js
class BomEvent {
    constructor(element) {
        this.element = element;
    }

    addEvent(type, handler) {
        if (this.element.addEventListener) {
            //事件类型、需要执行的函数、是否捕捉
            this.element.addEventListener(type, handler, false);
        } else if (this.element.attachEvent) {
            this.element.attachEvent('on' + type, function () {
                handler.call(element);
            });
        } else {
            this.element['on' + type] = handler;
        }
    }

    removeEvent(type, handler) {
        if (this.element.removeEnentListener) {
            this.element.removeEnentListener(type, handler, false);
        } else if (element.datachEvent) {
            this.element.detachEvent('on' + type, handler);
        } else {
            this.element['on' + type] = null;
        }
    }
}
// 阻止事件 (主要是事件冒泡，因为IE不支持事件捕获)
function stopPropagation(ev) {
    if (ev.stopPropagation) {
        ev.stopPropagation(); // 标准w3c
    } else {
        ev.cancelBubble = true; // IE
    }
}
// 取消事件的默认行为
function preventDefault(event) {
    if (event.preventDefault) {
        event.preventDefault(); // 标准w3c
    } else {
        event.returnValue = false; // IE
    }
}
```



## ajax  及 fetch API 详解

1. XMLHTTPRequest

2. fetch

- 默认不带cookie
- 错误不会reject
- 不支持超时设置
- 需要借用AbortController中止fetch

### 常见的浏览器请求/响应头/错误码解析


#### request header
```js
:method: GET
:path: /solar-comment/api/comment/tutor-primary-activity/senior-recommend/users/self?tagSource=&_productId=351&_appId=0
:scheme: https
accept: application/json, text/plain, */*
accept-encoding: gzip, deflate, br
cache-control: no-cache
cookie: deviceId=c122305d
origin: https://m.yuanfudao.biz
referer: https://m.yuanfudao.biz/primary/market/senior-recommend/reserve
user-agent: Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1
```
#### response header

```js
access-control-allow-credentials: true
access-control-allow-origin: https://m.yuanfudao.biz
content-encoding: gzip
content-type: application/json;charset=UTF-8
date: Thu, 06 Aug 2020 08:15:05 GMT
set-cookie: sess=QvrAQ0Cq+EcDQQPTer2XHlv4fhIRaW/YCb/e4pz/I+uSfZtum4dPp9q4HJL5o+GWuDXHXQLQF2JrIgwzZPaZHWal4qYZy/cfW0Sle/fyB/w=;domain=.yuanfudao.biz;path=/;HttpOnly
set-cookie: userid=172270653;domain=.yuanfudao.biz;path=/;HttpOnly
status: 200
```

#### status

- 200	get 成功
- 201 post 成功
- 301 永久重定向
- 302 临时重定向
- 304 协商缓存 服务器文件未修改
- 400 客户端请求有语法错误，不能被服务器识别
- 403 服务器受到请求，但是拒绝提供服务，可能是跨域
- 404 请求的资源不存在
- 405 请求的method不允许
- 500 服务器发生不可预期的错误

# 发送请求的示例，以及封装一个多浏览器兼容的请求函数

看代码
```js
let xhr = new XMLHttpRequest();
xhr.open('GET', 'http://domain/service');

// request state change event
xhr.onreadystatechange = function () {
    // request completed?
    if (xhr.readyState !== 4) return;

    if (xhr.status === 200) {
        // request successful - show response
        console.log(xhr.responseText);
    } else {
        // request error
        console.log('HTTP error', xhr.status, xhr.statusText);
    }
};

// xhr.timeout = 3000; // 3 seconds
// xhr.ontimeout = () => console.log('timeout', xhr.responseURL);

// progress事件可以报告长时间运行的文件上传
// xhr.upload.onprogress = p => {
//     console.log(Math.round((p.loaded / p.total) * 100) + '%');
// }

// start request
xhr.send();


fetch(
        'http://domain/service', {
            method: 'GET'
        }
    )
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(error => console.error('error:', error));

// 默认不带cookie

fetch(
    'http://domain/service', {
        method: 'GET',
        credentials: 'same-origin'
    }
)

// 错误不会reject
// HTTP错误（例如404 Page Not Found 或 500 Internal Server Error）不会导致Fetch返回的Promise标记为reject；.catch()也不会被执行。
// 想要精确的判断 fetch是否成功，需要包含 promise resolved 的情况，此时再判断 response.ok是不是为 true

fetch(
        'http://domain/service', {
            method: 'GET'
        }
    )
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(json => console.log(json))
    .catch(error => console.error('error:', error));

// 不支持直接设置超时, 可以用promise
function fetchTimeout(url, init, timeout = 3000) {
    return new Promise((resolve, reject) => {
        fetch(url, init)
            .then(resolve)
            .catch(reject);
        setTimeout(reject, timeout);
    })
}

// 中止fetch
const controller = new AbortController();

fetch(
        'http://domain/service', {
            method: 'GET',
            signal: controller.signal
        })
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(error => console.error('Error:', error));

controller.abort();
```

```ts
interface IOptions {
    url: string;
    type?: string;
    data: any;
    timeout?: number;
}

function formatUrl(json) {
    let dataArr = [];
    json.t = Math.random();
    for (let key in json) {
        dataArr.push(`${key}=${encodeURIComponent(json[key])}`)
    }
    return dataArr.join('&');
}

export function ajax(options: IOptions) {
    return new Promise((resolve, reject) => {
        if (!options.url) return;

        options.type = options.type || 'GET';
        options.data = options.data || {};
        options.timeout = options.timeout || 10000;
    
        let dataToUrlstr = formatUrl(options.data);
        let timer;
    
        // 1.创建
        let xhr;
        if ((window as any).XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
    
        if (options.type.toUpperCase() === 'GET') {
            // 2.连接
            xhr.open('get', `${options.url}?${dataToUrlstr}`, true);
            // 3.发送
            xhr.send();
        } else if (options.type.toUpperCase() === 'POST') {
            // 2.连接
            xhr.open('post', options.url, true);
            xhr.setRequestHeader('ContentType', 'application/x-www-form-urlencoded');
            // 3.发送
            xhr.send(options.data);
        }
    
        // 4.接收
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                clearTimeout(timer);
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.status);
                }
            }
        }
    
        if (options.timeout) {
            timer = setTimeout(() => {
                xhr.abort();
                reject('超时');
            }, options.timeout)
        }

        // xhr.timeout = options.timeout;
        // xhr.ontimeout = () => {
        //     reject('超时');
        // }
    });
}

```

