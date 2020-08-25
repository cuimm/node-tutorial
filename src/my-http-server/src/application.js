const http = require('http');
const chalk = require('chalk');
const url = require('url');
const path = require('path');
const fs = require('fs').promises;
const {createReadStream} = require('fs')
const mime = require('mime')

class Server {
  constructor(options) {
    this.port = options.port;
    this.address = options.address;
    this.directory = options.directory;
  }

  start() {
    // createServer方法中回调函数里面的this默认执行该方法的返回值，使用bind改变this指向
    const server = http.createServer(this.handleRequest.bind(this));
    server.listen(this.port, () => {
      console.log(`${chalk.yellow(`Starting up http-server, serving ./`)}`);
      console.log(`${chalk.yellow('Available on:')}`);
      console.log(`  http://${this.address}:${this.port}`);
    });
  }

  async handleRequest(req, res) {
    const {pathname} = url.parse(req.url);
    const filePath = path.join(this.directory, pathname);
    // console.log('filePath', filePath);
    try {
      // 检查文件
      const statObj = await fs.stat(filePath);
      if (statObj.isFile()) {
        this.handleFile(filePath, res);
      } else {
        this.handleDirectory(filePath, res);
      }
    } catch (e) {
      res.end('error', e);
    }
  }

  async handleDirectory(dirPath, res) {
    // console.log(fs.readdir(dirPath));
    const fileList = await fs.readdir(dirPath);
    console.log(fileList);


    res.end(dirPath);
  }

  async handleFile(filePath, res) {
    res.setHeader('Content-Type', `${mime.getType(filePath)}; charset=utf-8;`);
    createReadStream(filePath).pipe(res)
  }
}

module.exports = Server;

