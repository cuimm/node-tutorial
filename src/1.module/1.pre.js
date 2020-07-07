/*
* 如何让一个字符串执行？
* => 1、eval
* => 2、new Function(functionStr)
* */

// 1. eval缺陷：执行的时候会产生作用域问题，变量会向上查找
const str = 1;
eval(`console.log(str)`); // 输出1

// 2. new Function(args, functionStr)：最后一个参数是函数中的要执行的内容，前面的参数是函数参数
// new Function 默认不是向上查找变量
const fn = new Function('str', 'console.log(str)'); // 输出1
fn(100); // 打印100

console.log('********************************************************');

/*
=> node中实现模块化，靠的不是newFunction，靠的是自己的核心模块vm
=> node将模块分成三类
    1、核心模块  fs,path,util...
    2、自定义文件模块
    3、第三方模块  commander 需要安装使用方式和核心模块一致
*/


/*
* 1) 虚拟机模块 => vm
*
* vm 模块不是安全的机制。 不要使用它来运行不受信任的代码
* */
const vm = require('vm'); // 使用场景很长
vm.runInThisContext('console.log(100)'); // 用法像eval，但是执行字符串是是一个沙箱环境

console.log('********************************************************');


/*
* 2) 文件读取模块 => fs
*
* 读取的文件不存在会出错，写入的文件不存在会创建
* readFileSync 带有sync的是同步读取。同步读取会产生堵塞，读取文件不存在会抛出异常
* readFile 是异步读取
* */
const fs = require('fs');

let result = fs.readFileSync('./test.js', 'utf8'); // 同步读取文件，会产生阻塞。读取的文件不存在会抛出错误
let exists = fs.existsSync('./test.js'); // 判断文件是否存在
console.log('exists', exists);

console.log('********************************************************');


/*
* 3) 路径解析模块 => path
*
* 专门用来解析路径的
* resolve：路径解析。解析出一个绝对路径，遇到/就变成了根路径
* join：路径拼接
* dirname：父级路径
* extname：扩展名
* */
//
const path = require('path');
console.log('__dirname:', __dirname); // 当前文件模块所属目录的绝对路径，相当于是path.dirname(__filename)
console.log('__filename:', __filename); // 当前文件的绝对路径
console.log('path.dirname(__filename):', path.dirname(__filename)); // 当前文件的绝对路径

// => join 支持/的，resolve遇到了/就变成了根路径
console.log(path.join(__dirname, 'test.js')); // 路径拼接，相当于：__dirname +'/'+ 'test.js'
console.log(path.resolve(__dirname, 'test.js', '/')); // resolve是解析出一个绝对路径

console.log(path.dirname('a/b/c/test.js')); // 获取父路径
console.log(path.extname('a.min.js'));  // 取扩展名



