
// 模块

console.log('this', this); // {}
console.log('exports', exports); // {}
console.log('module.exports', module.exports); // {}

console.log(module.exports === exports); // true


module.exports = { name: 'hello' };

console.log('----------------------------------------------');

console.log(module.exports === exports); //  false
console.log('this', this);  // {}
console.log('exports', exports); // {}
console.log('module.exports', module.exports); // { name: 'hello' }
