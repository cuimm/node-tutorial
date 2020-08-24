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

module.exports = config
