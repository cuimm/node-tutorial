/*
响应也分为3个部分：
  => 1) 响应行 2) 响应头 3） 响应体

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
