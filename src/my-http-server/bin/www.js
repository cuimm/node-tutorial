#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const packageJson = require('../package')
const config = require('./config')
const createServer = require('../src/server')

program.name('cs')
program.usage('--option <value>')

Object.values(config).forEach(option => {
  program.option(option.option, option.description)
})

program.on('--help', () => {
  console.log(`Usages:\r`)
  Object.values(config).forEach(option => {
    console.log(`  ` + option.usage)
  })
})

program.version(packageJson.version)

// 解析用户参数
const userConfig = program.parse(process.argv)
// console.log('userConfig', userConfig);

const defaultConfig = {
  port: 8089,
  address: 'localhost',
  directory: process.cwd(),
}

// 最终配置
const mergeConfig = Object.assign({}, defaultConfig, userConfig)
// console.log('mergeConfig', mergeConfig);

// 创建服务
const server = createServer(mergeConfig)
server.start()
