/**
 * 简单模拟ejs模版渲染
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

function renderTemplate(filePath, data, cb) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // 将 <%=xxx %> 替换为 ${xxx}
  content = content.replace(/<%=(.+?)%>/g, (...args) => {
    return '${' + args[1].toString() + '}'
  });
  // 将 <% code %> 替换为 `\r\n code \r\n temp += `
  content = content.replace(/<%(.+?)%>/g, (...args) => {
    return '`' + os.EOL + args[1] + os.EOL + 'temp += `';
  });

  // 拼接字符串
  const header = `
    let temp = '';
    with (obj) {
      temp = 
  `;
  const body = '`' + content + '`;';
  const footer = `
    }
    return temp;
  `;
  const tpl = header + body + footer;

  // 传入形参obj,将字符串包裹成方法
  const fn = new Function('obj', tpl);
  cb(null, fn(data));
}

const result = renderTemplate('./template.html', {
  arr: [1, 2, 3],
}, (error, data) => {
  console.log(data);
});

