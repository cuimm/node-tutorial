/*** node_http模块_基础概念 ***/

/*
* 我们可以使用http模块创建高性能的web服务
* http 是node的核心模块，koa、express、egg、nest.js 等都是基于node中http模块封装的
* 浏览器发请求，服务器响应数据，整个的过程通过传输层来处理 tcp 协议
* http 基于tcp封装了一些规范（http中的header），http是应用层协议
* 服务端拿到的请求request，服务端响应给浏览器结果response
* */

const http = require('http');

// 服务器 => 在特定的ip地址和端口上来监听客户端的请求
// 端口号范围：0 - 65535 (一般我们使用 3000 以上端口)
const server = http.createServer(); // 内部基于的是EventEmiiter（发布订阅）

/**
 * req 代表的是客户端的信息，res 代表的是服务端响应的结果
 * req：是可读流，基于Stream模块，on('data') on('end')
 *
 * res：是可写流，基于Stream模块，write() end()
 */
server.on('request', (req, res) => {
  res.write('hello');
  res.end('ok');  // end 相当于：结束 + write方法，不调用end方法，请求会一直等待
});

let port = 8090;
server.listen(port, () => {
  console.log(`server start on ${port}`);
});

// 监听错误
server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    server.listen(++port);
  }
});

/*
* 1、nodemon
* nodemon（nodemonitor）：node的监视器，可以监视文件的变化，自动重启
* npm install nodemon -g
* nodemon + 文件名来实现：可以配置配置文件
*
*
* 2、pm2  进程管理
* */

