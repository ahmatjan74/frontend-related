const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class NPromise {
  FULFILLED_CALLBACK_LIST = [];
  REJECTED_CALLBACK_LIST = [];
  _status = PENDING;

  constructor(fn) {
    this.status = PENDING;
    this.value = null;
    this.reason = null;

    try {
      // fn: (resolve, reject) => {}
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }
  // getter 和 setter 来属性的监听和代理
  get status() {
    return this._status;
  }

  set status(newStatus) {
    this._status = newStatus;
    switch (newStatus) {
      case FULFILLED: {
        this.FULFILLED_CALLBACK_LIST.forEach((callback) => {
          callback(this.value);
        });
        break;
      }
      case REJECTED: {
        this.REJECTED_CALLBACK_LIST.forEach((callback) => {
          callback(this.reason);
        });
        break;
      }
    }
  }

  resolve(value) {
    if (this.status === PENDING) {
      this.value = value;
      this.status = FULFILLED;
    }
  }

  reject(reason) {
    if (this.status === PENDING) {
      this.reason = reason;
      this.status = REJECTED;
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = this.isFunction(onFulfilled)
      ? onFulfilled
      : (value) => {
          return value;
        };
    const realOnRejected = this.isFunction(onRejected)
      ? onRejected
      : (reason) => {
          throw reason;
        };

    const promise2 = new NPromise((resolve, reject) => {
      const fulfilledMicroTask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnFulfilled(this.value);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      const rejectedMicroTask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };

      switch (this.status) {
        case FULFILLED: {
          fulfilledMicroTask();
          break;
        }
        case REJECTED: {
          rejectedMicroTask();
          break;
        }
        case PENDING: {
          this.FULFILLED_CALLBACK_LIST.push(realOnFulfilled);
          this.REJECTED_CALLBACK_LIST.push(realOnRejected);
        }
      }
    });
    return promise2;
  }

  isFunction(params) {
    return typeof params === "function";
  }

  resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
      return reject(new TypeError("the promise & return value are the same"));
    }
    if (x instanceof NPromise) {
      queueMicrotask(() => {
        x.then((y) => {
          this.resolvePromise(promise2, y, resolve, reject);
        }, reject);
      });
    } else if (typeof x === "object" || this.isFunction(x)) {
      if (x === null) {
        return resolve(x);
      }
      let then = null;
      try {
        then = x.then;
      } catch (error) {
        return reject(error);
      }

      if (this.isFunction(then)) {
        let called = false;
        try {
          then.call(
            x,
            (y) => {
              if (called) {
                return;
              }
              called = true;
              this.resolvePromise(promise2, y, resolve, reject);
            },
            (r) => {
              if (called) {
                return;
              }
              called = true;
              reject(r);
            }
          );
        } catch (error) {
          if (called) {
            return;
          }
          reject(error);
        }
      } else {
        resolve(x);
      }
    } else {
      resolve(x);
    }
  }

  catch(onRejected) {
    this.then(null, onRejected);
  }

  static resolve(value) {
    if (value instanceof NPromise) {
      return value;
    }
    return new NPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new NPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

const test = new NPromise((resolve, rejest) => {
    // setTimeout(() => {
    //     resolve(111)
    // }, 100)
    resolve(111)
}).then((value) => {
    console.log(value)
})

console.log(test);
setTimeout(() => {
  console.log(test);
}, 8000);