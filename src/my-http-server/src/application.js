const http = require('http');
const chalk = require('chalk');
const url = require('url');
const path = require('path');
const fs = require('fs').promises;
const {createReadStream} = require('fs')
const mime = require('mime');
const ejs = require('ejs');

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
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * 渲染文件夹
   * @param dirPath
   * @param res
   * @returns {Promise<void>}
   */
  async handleDirectory(dirPath, res) {
    console.log('handleDirectory');
    // 读取文件夹
    const dirs = await fs.readdir(dirPath);
    // 读取模版
    const template = await fs.readFile(path.join(__dirname, 'template.html'), 'utf-8');
    // ejs渲染模版
    const renderTemplate = await ejs.render(template, {dirs}, {async: true});
    // 返回
    res.end(renderTemplate);
  }

  /**
   * 渲染文件
   * @param filePath
   * @param res
   * @returns {Promise<void>}
   */
  async handleFile(filePath, res) {
    res.setHeader('Content-Type', `${mime.getType(filePath)}; charset=utf-8;`);
    createReadStream(filePath).pipe(res)
  }

  handleError(error, res) {
    console.log('error', error);
    res.statusCode = 404;
    res.end('Not Found');
  }
}

module.exports = Server;

