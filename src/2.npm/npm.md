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
