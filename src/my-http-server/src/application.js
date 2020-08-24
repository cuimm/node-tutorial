const http = require('http')
const chalk = require('chalk')
const url = require('url')

class Server {
  constructor(options) {
    this.port = options.port
    this.address = options.address
    this.directory = options.directory
  }
  start() {
    const server = http.createServer(this.handleRequest.bind(this)) // createServer方法中回调函数里面的this默认执行该方法的返回值，使用bind改变this指向
    server.listen(this.port, () => {
      console.log(`${chalk.yellow(`Starting up http-server, serving ./`)}`)
      console.log(`${chalk.yellow('Available on:')}`)
      console.log(`  http://${this.address}:${this.port}`)
    })
  }
  handleRequest(req, res) {
    console.log(req.url);
    res.end('')
  }
}

module.exports = Server

