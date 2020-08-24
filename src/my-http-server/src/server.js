const Server = require('./application')

/**
 * 创建服务（工厂服务）
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
  })
}

module.exports = createServer
