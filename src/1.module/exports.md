### nodejs中的导出对象 modules.exports 和 exports 区别

> 默认 modules.exports 和 exports 指向同一个空对象{}，如果模块内部没有将modules.exports 或者 exports指向一个全新的对象，则这两个对象是相等的


#### 首先了解require内部原理
> require 方法内部实现原理：通过读取文件内容，将内容包装到一个自执行函数中，该函数返回module.exports.
```
// 封装的自执行函数如下：
// 执行下面方法的时候，用call改变this指向，默认指向module.exports
// 第一个参数：module的exports属性
// 第二个参数：require 方法定义
// 第三个参数：module对象
// 伪代码如下：let thisValue = module.exports;
(function(exports, require, module, filename, dirname){
    // 模块内容
    module.exports = 'hello';
}).call(thisValue, exports, module, module.id, path.dirname(module.id));
```

```
// id 为模块路径，首先解析该模块的绝对路径，然后读取模块内容，根据不同扩展名编译模块，最终返回module.exports对象
function require(id) {
    const fileName = Module._resolveFilename(id);
    const module = new Module(fileName);
    module.load();
    
    return module.exports;
}

```


+ 区别
    * exports 只能使用语法向外暴露内部变量。如：exports.xxx = xxx;
    * module.exports 既可以通过语法，也可以直接赋值一个对象。
    
> exports和module.exports其实是一个东西，因为在require方法内部模块内容封装的时候，传入的exports是module的一个属性
```
// 输出结果为：true
console.log(module.exports === exports); 
```


+ 但是，当exports再指向一个引用类型的时候，那么他们就不再全等：
```
    exports = [0, 1];
    console.log(exports === module.exports); // 输出结果为：false
```

+ 当然，如果直接通过 exports.xxx = xxx 或者 module.exports.xxx = xxx 的形式赋值，那么他们依然会指向同一个地址：
```
    exports.array = [0, 1];
    console.log(exports === module.exports); // 输出结果为：true
```

这个时候要明白module.exports和exports的区别，就要清楚什么是值类型，什么是引用类型。
我对值类型和引用类型的理解就是，看它是存储在栈上，还是存储在堆上，
值类型就是存储在栈上，引用类型是存储在堆上，
但是有个很特殊的情况是，引用类型的名字，是存储在栈上，然后这个名字指向了堆上的一个地址，从而可以直接使用变量名，调用堆上的数据。

