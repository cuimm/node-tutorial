## 常见的模块有哪些呢？
+ es6Module
    * import 引用模块
    * export导出模块
+ commonjs规范
    * module.exports 导出模块
    * require 引入模块
+ CMD
    * seajs在推广过程中对模块定义的规范
    * require （已过时）
+ AMD
    * Asynchronous Module Definition异步模块定义（已过时）
    * define、require
    * require([module], callback)
+ UMD
    * 统一模块规范 
    * 用于项目打包
    * 可以兼容commonjs + cmd + amd + 挂在到全局上

## 模块化的好处
- 解决命名冲突问题，如果用唯一标识解决冲突问题，会导致调用时路径过长
- 方便管理我们的代码（一个文件一个功能，每个文件都是一个模块）

## commonjs模块化的规范
- 每个文件都是一个模块
- 使用 module.exports 导出模块
- 使用require 去引用模块

> ES6模块叫静态导入。存在变量提升。import() 方法支持动态导入。
> commonjs是动态导入的。require()方法是同步的。    （例如：require('math')之后运行，因此必须等math.js加载完成。也就是说，如果加载时间很长，整个应用就会停在那里等。您会注意到 require 是同步的）。

## 调试node代码
1. node --inspect-brk ./src/1.module/1.pre.js
2. chrome://inspect/#devices
3. inspect


## 模块的分类 
- 核心模块 内置模块
- 第三方模块 （需要安装） npm（node package manager）
- 文件模块 （自己通过./ 或 绝对路径的方式来访问）

> 3n  `npm(包管理工具) nrm(源管理工具)  nvm(版本管理工具)`

## 第三方模块的安装方式
- 本地安装 （在代码中会用到这个模块） 
- 全局安装  (只能在命令行中使用的 vue create)  -g

```bash
npm cache clean --force
```

> 命令可以直接被执行 应该配置在path目录下（npm目录下的内容可以被直接访问），这里使用nrm 招的是 npm中的nrm （npm在path中所以可以直接访问，nrm也可以直接访问），通过node来执行这些we年

C:\Users\test1\AppData\Roaming\npm\nrm -> C:\Users\test1\AppData\Roaming\npm\nod
e_modules\nrm\cli.js


## nrm
- nrm --help 
- nrm ls / nrm use 

> 自己写一个全局包 并发布到npm上

## 初始化包
```bash
npm init -y
```

> 需要更改名字 添加bin参数 指定使用的命令和对应执行的文件

全局包需要添加 执行头
```
#! /usr/bin/env node
//.....
```

> 直接使用npm link 连接到当前项目下直接访问

## 发布包需要有npm账号
> 发包都使用命令行来发布 

- 切换到官方源
- npm addUser
- npm publish
- 每次更改内容后需要重新升级版本，再次发布
- npm unpublish

> 考察包 star + issue + 下载量 + 单元测试 + 覆盖率 


## 安装本地包
- 在代码中或者当前项目中用到这个包

> 能不放全局就不放全局 防止两个人的版本有冲突

```
npm  i webpack --save-dev / -D
npm uninstall webpack --save-dev
```

> --save-dev 表示用在开发模式下使用，生产环境是不要的

## scripts的配置
- 你配置的scripts属性，相当于是一个命令的别名
- npm run 的时候会将当前的node_modules 下.bin 文件放到环境变量中执行后就被删除了 (可以执行当前项目的下的对应包的命令)
- npx 可以直接执行.bin 文件夹下的命令 （如果.bin下没有 会去安装）  生成项目等可以采用这种方式 （不需要再全局安装，每次全局安装的版本不是最新的）
- npx create-react-app xxx

## 那有哪些版本
- 分配成三部分 semver  大版本.小版本.补丁
- ^1.3.0 比2小的 比 1.3大的版本都ok     1.3 <= x <2  
- ~1.3.0  指定 小版本  固定好了 必须是  1.3 开头   1.3.1 1.3.2
- >=2.1
- <=2.1
- 1.0.0-2.0.0
- alpha + beta + rc (只有指定版本后才会安装 用于测试)  vue3.0.0@beta.15  vue3


##  哪些依赖
- 开发依赖 --save-dev
- 生产依赖 --save
- 同等依赖 peerDependencies
- 打包依赖 捆绑依赖
