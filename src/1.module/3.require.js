const vm = require('vm');
const path = require('path');
const fs = require('fs');

function Module(id) {
    this.id = id;   // 模块唯一标示：模块当前路径
    this.exports = {};  // 模块导出对象
}

Module._extensions = ['.js', '.json'];

Module.wrapper = [
    '(function (exports, require, module, __filename, __dirname) { ',
    '\n});'
];

Module._extensions['.js'] = function (module) {
    const content = fs.readFileSync(module.id, 'utf-8');
    const wrapper = Module.wrap(content);
    /*
    (function (exports, require, module, __filename, __dirname) {
        module.exports = 'hello';
    });
    */
    const fn = vm.runInThisContext(wrapper);

    // module.exports 和 exports
    // https://zhuanlan.zhihu.com/p/87729137
    // *****************************************
    // let exports = module.exports = {}
    // exports.a = 'hello'
    // return module.exports
    // ***********************************
    let thisValue = module.exports;
    fn.call(thisValue, module.exports, myRequire, module, module.id, path.dirname(module.id));
};

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
    for (let i = 0; i < Module._extensions.length; i++) {
        const extension = Module._extensions[i];
        const concatFilePath = filePath + extension;
        if (fs.existsSync(concatFilePath)) {
            return concatFilePath;
        }
    }
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

function myRequire(id) {
    const fileName = Module._resolveFilename(id);
    const module = new Module(fileName);
    module.load();

    return module.exports;
}

const result = myRequire('./test');
console.log('result', result);

// console.log(path.resolve(__dirname, './test'));
