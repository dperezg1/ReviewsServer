var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'reviewsServer'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/reviewsServer-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'reviewsServer'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/reviewsServer-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'reviewsServer'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/reviewsServer-production'
  }
};

module.exports = config[env];
