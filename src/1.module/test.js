console.log('this', this);
/*
exports只能使用语法来向外暴露内部变量：如http://exports.xxx = xxx;
module.exports既可以通过语法，也可以直接赋值一个对象。

我们要明白一点，exports和module.exports其实是一个东西，不信我们来输出一下：
    console.log(module.exports === exports); // 输出结果为：true

输出结果是true其实就说明它们就是一个东西，其实exports = module.exports，因为他们是引用类型的一个变量名。
所以当exports再指向一个引用类型的时候，那么他们就不再全等：
    exports = [0, 1];
    console.log(exports === module.exports); // 输出结果为：false

当然，如果直接通过 exports.xxx 的形式赋值，那么他们依然会指向同一个地址：
    exports.array = [0, 1];
    console.log(exports === module.exports); // 输出结果为：true


这个时候要明白module.exports和exports的区别，就要清楚什么是值类型，什么是引用类型。
我对值类型和引用类型的理解就是，看它是存储在栈上，还是存储在堆上，
值类型就是存储在栈上，引用类型是存储在堆上，
但是有个很特殊的情况是，引用类型的名字，是存储在栈上，然后这个名字指向了堆上的一个地址，从而可以直接使用变量名，调用堆上的数据。
* */

console.log(module.exports === exports);
module.exports = 'hello';
// console.log(exports);

/*
var sayHello = function(){
    console.log('hello')
}
exports.sayHello = sayHello;
console.log(exports);
console.log(module.exports);
// exports 是 module.exports 的一个引用？？？
*/
