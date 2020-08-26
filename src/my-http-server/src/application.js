/** 核心模块 **/
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const zlib = require('zlib');

/** 第三方模块 **/
const chalk = require('chalk');
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
    try {
      // 检查文件
      const statObj = await fs.stat(filePath);
      if (statObj.isFile()) {
        this.handleFile(filePath, req, res, statObj);
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
  async handleFile(filePath, req, res, statObj) {
    res.setHeader('Content-Type', `${mime.getType(filePath)}; charset=utf-8;`);
    const cache = await this.cache(req, res, filePath, statObj);
    // if (cache) {
    //   res.statusCode = 304;
    //   return res.end();
    // }
    // 如果没有缓存，就返回压缩文件
    const gzip = this.gzip(req, res);
    if (gzip) {
      // 如果支持压缩，就返回压缩流（test.html文件：gzip压缩前17.9k，gzip压缩后569B）
      createReadStream(filePath).pipe(gzip).pipe(res);
    } else {
      createReadStream(filePath).pipe(res);
    }
  }

  handleError(error, res) {
    console.log('error', error);
    res.statusCode = 404;
    res.end('Not Found');
  }

  /**
   * 缓存处理
   * @param req
   * @param res
   * @param filePath
   * @param statObj
   * @returns {Promise<boolean>}
   */
  async cache(req, res, filePath, statObj) {
    // 强制缓存-设置响应头 cache-control
    res.setHeader('Cache-Control', 'max-age=10'); // cache-control 强制缓存 10s
    // 强制缓存-设置响应头 Expires
    res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString()); // expires 强制缓存 10s

    // 协商缓存-设置响应头Etag （Etag / If-none-match）此处将文件内容hash作为etag,粗略计算文件内容
    const content = await fs.readFile(filePath);
    const eTag = this.md5(content);
    res.setHeader('etag', eTag);

    // 协商缓存-设置响应头 （last-modified / if-modified-since）
    const lastModified = statObj.ctime.toGMTString();
    res.setHeader('last-modified', lastModified);

    // 协商缓存-对比
    const ifNoneMatch = req.headers['if-mone-match'];
    const ifModifiedSince = req.headers['if-modified-since'];
    // 协商缓存-命中Etag
    if (ifNoneMatch === eTag) {
      return true;
    }
    // 协商缓存-命中last-modified
    if (ifModifiedSince === lastModified) {
      return true;
    }
    return false;
  }

  /**
   * gzip压缩
   * @param req
   * @param res
   * @returns {*}
   */
  gzip(req, res) {
    const acceptEncoding = req.headers['accept-encoding'];
    if (acceptEncoding && acceptEncoding.includes('gzip')) {
      // 返回头中添加 Content-Encoding: gzip：浏览器看到这个标示会自动解压缩
      res.setHeader('Content-Encoding', 'gzip');
      // 返回gzip对象
      return zlib.createGzip();
    } else {
      return false;
    }
  }

  md5(val) {
    return crypto.createHash('md5').update(val).digest('base64');
  }
}

module.exports = Server;

