const Server = require('./application');

/**
 * 创建服务（工厂服务）- 将new操作单独封装起来，不关注内部实现细节；屏蔽内部实现细节，只提供创建的入口。
 * @param port  端口号
 * @param address 地址
 * @param directory 启动目录
 * @returns {Server} 返回Server实例
 */
function createServer({port, address, directory} = {}) {
  return new Server({
    port,
    address,
    directory,
  });
}

module.exports = createServer;
