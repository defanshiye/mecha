'use strict';

const webpack = require('webpack');
const serverConfig = require('../config/server.config');

const compiler = webpack(serverConfig);

compiler.run((err, stats) => {
  // 编译完成后的回调函数
  if (err) {
    console.error(err);
  } else {
    console.log(stats.toString());
    console.log('=============>>>>>>>>>>>');
    console.log('=============>>>>>>>>>>>');
    require('../.mecha/server.bundle');
  }
});
