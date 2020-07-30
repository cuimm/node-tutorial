## node http模块

- 我们可以使用http模块创建高性能的web服务
- http 是node的核心模块，koa、express、egg、nest.js 等都是基于node中http模块封装的
- 浏览器发请求，服务器响应数据，整个的过程通过传输层来处理 tcp 协议
- http 基于tcp封装了一些规范（http中的header），http是应用层协议
- 服务端拿到的请求request，服务端响应给浏览器结果response

```
const http = require('http');
const server = http.createServer(); 

/*
req 代表的是客户端的信息，res 代表的是服务端响应的结果
req：是可读流，基于Stream模块，on('data') on('end')
res：是可写流，基于Stream模块，write() end()
*/
server.on('request', (req, res) => {
  res.write('hello');
  res.end('ok');  // end 相当于：结束 + write方法，不调用end方法，请求会一直等待
});

// 服务器 => 在特定的ip地址和端口上来监听客户端的请求
// 端口号范围：0 - 65535 (一般我们使用 3000 以上端口)
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
```

## http request 请求

### 报文
> 请求发送过来有三部分组成：1)请求行 2)请求头 3)请求体    

> 1、请求行：方法 + 路径 + 协议
> 1-1）请求方法 request.method
- 请求方法有哪些？get、post、put、delete、options请求。默认一般比较常用的是get和post => 简单请求
- 简单请求 => 复杂请求：自定义header
- options预检请求：
    跨域时出现：跨域访问某个资源时，先发一个预检请求（复杂请求时才会发送）
    当跨域时并且复杂请求才会发options请求 （可以设置有效时间、什么时候发送请求）

> 1-2）请求路径
- req.url => 请求地址 /后面的 和 # 前面的
- hash不属于请求路径。hash是给前端用的，用来做路由的

> 1-3）请求协议
- HTTP/1.1


> 2、请求头 request.headers
- 请求头部由关键字/值对组成，每行一对，关键字和值用英文冒号“:”分隔。请求头部通知服务器有关于客户端请求的信息，典型的请求头有：
      User-Agent：产生请求的浏览器类型。
      Accept：客户端可识别的内容类型列表。
      Host：请求的主机名，允许多个域名同处一个IP地址，即虚拟主机。

> 3、请求体
- 传递数据

```
const http = require('http');
const url = require('url');

let port = 8090;

const server = http.createServer();

server.listen(port, () => {
  console.log(`server start on port ${port}`);
});

server.on('request', (req, res) => {
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
  请求头部由关键字/值对组成，每行一对，关键字和值用英文冒号“:”分隔。请求头部通知服务器有关于客户端请求的信息，典型的请求头有：
    User-Agent：产生请求的浏览器类型。
    Accept：客户端可识别的内容类型列表。
    Host：请求的主机名，允许多个域名同处一个IP地址，即虚拟主机。
  * */
  console.log(req.headers); // key node默认都转换成了小写

  /*
  * 3、请求体
  *
  * 必须得能传递数据 （post put 可以传递数据的）
  * socket 包含着请求和响应 我们需要解析他，解析后会创建一个流，将数据放到流中，我们再去这个流中读取数据
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
```


```
curl  -d name=cuimm http://localhost:8090//?age=18#aaa

    GET / HTTP/1.1           (此处是：请求方法 + 请求路径 + 请求协议)
    Host: localhost:3000     (以下是请求头)
    Connection: keep-alive 
```


### http response
> 响应也分为3个部分：1) 响应行  2) 响应头  3）响应体

```
/*
node的主线程是单线程的
多个请求来了，线性处理，阻塞（异步的i/o ）如果有大量的计算就会导致卡死
*/

const http = require('http')
const url = require('url')

const server = http.createServer();

server.on('request', (req, res) => {
  // 响应状态码
  res.statusCode = 309 // 不能自定义，其实可以瞎写但是浏览器不认
  res.statusMessage = 'ok1' // 不建议自己瞎编状态码

  res.setHeader('name','cuimm'); // 自定义header 来描述响应的结果

  res.end('ok') // 将内容返回给浏览器 如果是直接访问就显示到页面上，如果是通过ajax来访问就返回到ajax的结果中
})

server.listen(3000, () => {
  console.log(`server start port 3000`);
});


/*
curl http://localhost:3000/

response headers:
  HTTP/1.1 309 ok1     （此处是响应行(协议 + 响应状态码statusCode + 状态消息statusMessage) 以下的是响应头）
  name: cuimm
  Date: Thu, 30 Jul 2020 10:16:39 GMT
  Connection: keep-alive
  Content-Length: 2
*/

```
