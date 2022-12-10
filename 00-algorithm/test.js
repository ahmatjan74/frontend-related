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


function Parent() {
    this.name = 'ahmatjan'
}

Parent.prototype.getName = function() {
    return this.name;
}

function Children() {

}
Children.prototype = new Parent();
const children = new Children();
console.log(children.getName())