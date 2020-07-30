#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const packageJson = require('../package')

const config = {
  port: {
    option: '-p --port <v>',
    description: 'Port to use [8080]',
    usage: 'cs -p 8080',
  },
  address: {
    option: '-a --address <v>',
    description: 'Address to use [0.0.0.0]',
    usage: 'cs --address 127.0.0.1',
  },
  directory: {
    option: '-d --directory <v>',
    description: 'Show directory listings [true]',
    usage: 'cs -d D:'
  },
}
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
console.log('userConfig', userConfig);
