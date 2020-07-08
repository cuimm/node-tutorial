const vm = require('vm');
const path = require('path');
const fs = require('fs');

function Module(id) {
    this.id = id;
    this.exports = {};
}

Module.extensions = Object.create(null);
Module.cache = Object.create(null);
Module.wrapper = [
    '(function (exports, module, require, filename, dirname) { ',
    '\n});'
];

Module.wrap = function (content) {
    return Module.wrapper[0] + content + Module.wrapper[1];
};

Module.resolveFilename = function (filename) {
    const filePath = path.resolve(__dirname, filename);
    const exists = fs.existsSync(filePath);
    if (exists) {
        return filePath;
    } else {
        const extensions = Object.keys(Module.extensions);
        for (let i = 0; i < extensions.length; i++) {
            let concatPath = filePath + extensions[i];
            if (fs.existsSync(concatPath)) {
                return concatPath;
            }
        }
    }
    throw new Error('module not found');
};

Module.extensions['.js'] = function (module) {
    const content = fs.readFileSync(module.id, 'utf-8');
    const wrapper = Module.wrap(content);
    const compiledWrapper = vm.runInThisContext(wrapper);

    // 让包装过的函数执行，改变this指向，模块内部指向module.exports => 默认模块内部的exports===module.exports === {}，除非重新执行新的内存地址的时候，二者才不再相等
    compiledWrapper.call(module.exports, module.exports, module, __require, module.id, path.dirname(module.id));
};

Module.extensions['.json'] = function (module) {
    const content = fs.readFileSync(module.id);
    try {
        module.exports = JSON.parse(content);
    } catch (e) {
        throw e.message;
    }
};

Module.prototype.load = function () {
    const extension = path.extname(this.id);
    Module.extensions[extension](this);
};

function __require(id) {
    const filePath = Module.resolveFilename(id);
    if (Module.cache[filePath]) {
        return Module.cache[filePath].exports;
    }
    const module = new Module(filePath);
    module.load();
    Module.cache[filePath] = module;
    return module.exports;
}

console.time('---------------------------------------------');
let result = __require('../assets/test.js');
result = __require('../assets/test.js');
result = __require('../assets/test.js');
result = __require('../assets/test.js');
result = __require('../assets/test.js');
result = __require('../assets/test.js');
let info = __require('../assets/info');
console.timeEnd('---------------------------------------------');
console.log('result=', result);
console.log('info=', info);
