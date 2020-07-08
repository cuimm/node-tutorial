const vm = require('vm');
const path = require('path');
const fs = require('fs');

function Module(id) {
    this.id = id;   // 模块唯一标示：模块当前路径
    this.exports = {};  // 模块导出对象
}

// 缓存模块（此处的_cache对象只需要来保存一些数据，去掉原型链可以提高性能）
Module._cache = Object.create(null);
// 用来扩展不同类型模块的加载逻辑
Module._extensions = Object.create(null);
// 导出.js文件时包装的自执行函数
Module.wrapper = [
    '(function (exports, require, module, __filename, __dirname) { ',
    '\n});'
];

Module.wrap = function (script) {
    return Module.wrapper[0] + script + Module.wrapper[1];
};

/**
 * 解析模块路径
 * 1.先检查文件是否存在，存在=>加载
 * 2.不存在，尝试加载指定扩展名文件
 * @param filename 要加载的模块
 * @private
 */
Module._resolveFilename = function (filename) {
    const filePath = path.resolve(__dirname, filename);
    const exists = fs.existsSync(filePath);
    if (exists) {
        return filePath;
    }

    const keys = Object.keys(Module._extensions);
    for (let i = 0; i < keys.length; i++) {
        const extension = keys[i];
        const concatFilePath = filePath + extension;
        if (fs.existsSync(concatFilePath)) {
            return concatFilePath;
        }
    }
    throw new Error('not found module');
};

/**
 * 加载模块
 */
Module.prototype.load = function (module) {
    // 获取扩展名
    const extension = path.extname(this.id);
    // 设计模块/策略模式（通过不同扩展名加载不同的逻辑）
    Module._extensions[extension](this);
};

// extension for .js
Module._extensions['.js'] = function (module) {
    const content = fs.readFileSync(module.id, 'utf-8');
    const wrapper = Module.wrap(content);
    /*
    (function (exports, require, module, __filename, __dirname) {
        module.exports = 'hello';
    });
    */
    const fn = vm.runInThisContext(wrapper);

    let thisValue = module.exports;
    fn.call(thisValue, module.exports, myRequire, module, module.id, path.dirname(module.id));
};

// extension for .json
Module._extensions['.json'] = function (module) {
    const content = fs.readFileSync(module.id, 'utf-8');
    try {
        module.exports = JSON.parse(content);
    } catch (e) {
        throw e.message;
    }
};

function myRequire(id) {
    // 转化成绝对路径
    const fileName = Module._resolveFilename(id);
    // 首先从缓存中读取模块，若多次读取返，返回原来的exports对象
    if (Module._cache[fileName]) {
        return Module._cache[fileName].exports;
    }
    // 根据路径来缓存模块
    const module = new Module(fileName);
    // 加载模块
    module.load();
    // 缓存模块
    Module._cache[fileName] = module;
    // 返回module.exports对象
    return module.exports;
}


console.log('----------------EXAMPLE------------------');

let result = myRequire('./assets/test');
result = myRequire('./assets/test');
result = myRequire('./assets/test');
result = myRequire('./assets/test');

console.log('** result=', result);

let info = myRequire('./assets/info');
console.log('** info=', info);
