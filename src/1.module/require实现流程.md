
1. 模块化的实现原理：通过函数来隔离作用域。会将 module.exports 返回给当前模块。
2. require的读取方式是同步的。
3. 导出引用类型和非引用类型的区别：导出的是引用类型，变化后可以拿到最新的结果。如果是非引用类型，变化后拿不到最新的结果


node调试：
    1) 通过chrome浏览器调试 （比较适合 第三方模块的调试）
        node --inspect-brk 文件名
        chrome://inspect/#devices
    2) 编辑器调试


let result = require('./test');


调试require的整个实现流程
1. Module.prototype.require 要实现一个require（在 userModuleTest 模块中 使用了test.js文件）
2. Module._load加载模块
3. 加载模块时，检查查看是否有缓存，有缓存 就使用缓存，没有再加载
4. 如果没有缓存，就直接将模块路径转化成绝对路径 Module._resolveFilename
5. 根据转化的路径在查看是否有缓存机制，如果没有缓存看一下是否是原生的模块
6. new Module 创建模块：id（唯一的路径）exports(导出的结果 {}) 属性
7. 把模块缓存起来，为了下次使用时可以使用上次缓存的模块
8. module.load 加载模块
9. 拿到文件的扩展名 Module._extensions 调用对应的模块的解析规则
10. 读取文件模块，编译模块
11. 包装成函数，并且让函数执行，模块的this指代的是exports对象  exports require module __dirname,__filename
12. 最终require 的返回结果就是 module.exports 的结果


    function(exports require module __dirname,__filename){
        module.exports = 'hello'
    }

