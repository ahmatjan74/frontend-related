// class BankAccount {
//     constructor(balance=1000) {
//         this._balance = balance
//     }

//     set balance(balance) {
//         this._balance = balance;
//     }

//     get balance() {
//         return this._balance
//     }
// }

// const _bankAccount = new BankAccount()
// console.log(_bankAccount.balance)
// _bankAccount.balance = 10000;
// console.log(_bankAccount.balance)

// class Shape {
//     constructor(color) {
//         this.color = color;
//     }

//     setColor(color) {
//         this.color = color;
//     }

//     render(area) {
//         console.log('render', area)
//     }
// }

// class Rectangle extends Shape {
//     constructor(width, height) {
//         super();
//         this.width = width;
//         this.height = height
//     }

//     getArea() {
//         return this.width * this.height;
//     }
// }

// class Square extends Shape {
//     constructor(width) {
//         super();
//         this.width = width;
//     }

//     getArea() {
//         return this.width * this.width;
//     }
// }

// const renderShapes = (shapes) => {
//     shapes.forEach(element => {
//         const area = element.getArea();
//         element.render(area);
//     });
// }

// const elements = [new Square(10), new Rectangle(40, 50)];
// renderShapes(elements);

// function Parent() {
//     this.name = 'ahmatjan'
// }

// Parent.prototype.getName = function() {
//     return this.name;
// }

// function Children() {

// }
// Children.prototype = new Parent();
// const children = new Children();
// console.log(children.getName())

class MyPromise {
  constructor(executor) {
    this.initValue();
    this.initBind();
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject("error");
    }
  }

  initValue() {
    this.promiseResult = null;
    this.promiseState = "pending";
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
  }

  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  resolve(value) {
    if (this.promiseState !== "pending") {
      return;
    }
    this.promiseResult = value;
    this.promiseState = "fulfilled";

    while (this.onFulfilledCallbacks.length) {
      this.onFulfilledCallbacks.shift()(this.promiseResult);
    }
  }

  reject(reason) {
    if (this.promiseState !== "pending") {
      return;
    }
    this.promiseResult = reason;
    this.promiseState = "rejected";

    // 失败的回掉函数
    while (this.onRejectedCallbacks.length) {
      // 一个个执行
      this.onRejectedCallbacks.shift()(this.promiseResult);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    let thenPromise = new MyPromise((resolve, reject) => {
      const resolvePromise = (cb) => {
        setTimeout(() => {
          try {
            const x = cb(this.promiseResult);
            if (x === thenPromise) {
              throw new Error("不能返回自身");
            }
            if (x instanceof MyPromise) {
              x.then(resolve, reject);
            } else {
              resolve(x);
            }
          } catch (error) {
            reject(error);
            throw new Error(error);
          }
        });
      };

      if (this.promiseState === "fulfilled") {
        resolvePromise(onFulfilled);
      } else if (this.promiseState === "rejected") {
        resolvePromise(onRejected);
      } else if (this.promiseState === "pending") {
        // onFulfilled.bind(this)
        // onRejected.bind(this)
        this.onFulfilledCallbacks.push(resolvePromise.bind(onFulfilled, this));
        this.onRejectedCallbacks.push(resolvePromise.bind(onRejected, this));
      }
    });

    return thenPromise;
  }
}

const promise1 = new MyPromise((resolve, reject) => {
  resolve("success");
});
const promise2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject("fail");
  }, 1000);
}).then((val) => {
  console.log(val);
});
console.log(promise1, promise2);
