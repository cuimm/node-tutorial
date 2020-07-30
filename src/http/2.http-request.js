const http = require('http');
const url = require('url');

let port = 8090;

const server = http.createServer();

server.listen(port, () => {
  console.log(`server start on port ${port}`);
});

server.on('request', (req, res) => {
  /*
  * 报文
  * 请求发送过来有三部分组成：请求行、请求头、请求体
  *
  *
  * 1、请求行：方法 + 路径 + 协议
  *
  * 请求方法有哪些？get、post、put、delete、options请求。默认一般比较常用的是get和post => 简单请求
  * 简单请求 => 复杂请求：自定义header
  *
  * restfulApi风格（不是规范不用必须遵守）=> 用户的增删改查 (根据不同的方法来区分对资源做什么操作)
  *
  *
  * options预检请求
  *   跨域时出现：跨域访问某个资源时，先发一个预检请求（复杂请求时才会发送）
  *   当跨域时并且复杂请求才会发options请求 （可以设置有效时间、什么时候发送请求）
  * */

  // 1-1、请求方法 req.method
  console.log(req.method); // 获取请求方法（默认是大写的,需要自己转）

  /*
  * url模块：可以处理url路径，把路径解析成对象
  *
  * 1-2、请求路径 req.url => /后面的 和 # 前面的
  * hash是给前端用的，用来做路由的
  * */
  let {pathname, query} = url.parse(req.url, true); // 获取请求路径
  console.log(pathname, query); // 请求行中可以通过query 来进行传递参数

  /*
  1-3、请求协议：HTTP/1.1

  curl http://localhost:8090/

    HTTP/1.1 309 unknown
    Date: Thu, 30 Jul 2020 10:07:32 GMT
    Connection: keep-alive
    Content-Length: 2
   */


  /*
  * 2、请求头
  *
  * cookie：是在请求头里面的，可以传递数据
  * */
  console.log(req.headers); // key node默认都转换成了小写

  /*
  * 3、请求体
  *
  * 必须得能传递数据 （post put 可以传递数据的）
  * socket 包含着请求和响应 我们需要解析他，解析后会创建一个流，将数据放到流中，我们再去这个流中读取数据
  *
  * curl -d name=cuimm http://localhost:8090/?a=2#aaa
  * */
  let arr = [];  // 可读流的用法
  req.on('data', function (chunk) {
    arr.push(chunk);
  });
  req.on('end', function () {
    console.log(Buffer.concat(arr).toString())
  });
  res.end('ok');
});

server.on('error', error => {
  if (error.code === 'EADDRINUSE') {
    server.listen(++port);
  }
});
