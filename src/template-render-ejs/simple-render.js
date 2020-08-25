const originTemp = `
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>template</title>
</head>
<body>
  <%arr.forEach(item => {%>
    <li><%=item %></li>
  <%})%>
</body>
</html>
`;

function render(obj) {
  let temp = '';
  with (obj) {
    temp = `
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>template</title>
      </head>
      <body>
        `
    arr.forEach(item => {
      temp += `<li>${item}</li>`
    })
    temp += `
      </body>
      </html>
    `;
  }
  return temp;
}

let obj = {
  arr: [1, 2, 3],
}
console.log(render(obj));
