'use strict';

const express = require('express');
const webpack = require('webpack');
const isObject = require('is-object');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const clientConfig = require('../config/client.config');

const compiler = webpack(clientConfig);
const app = express();

function normalizeAssets(assets) {
  if (isObject(assets)) {
    return Object.values(assets);
  }

  return Array.isArray(assets) ? assets : [assets];
}

app.use(express.static('public'));
app.use(webpackDevMiddleware(compiler, { serverSideRender: true }));
app.use(webpackHotMiddleware(compiler));
app.use((req, res) => {
  const { devMiddleware } = res.locals.webpack;
  const outputFileSystem = devMiddleware.outputFileSystem;
  const jsonWebpackStats = devMiddleware.stats.toJson();
  const { assetsByChunkName, outputPath } = jsonWebpackStats;

  // Then use `assetsByChunkName` for server-side rendering
  // For example, if you have only one main chunk:
  res.send(`
<html>
  <head>
    <title>My App</title>
    <style>
    ${normalizeAssets(assetsByChunkName.main)
      .filter(path => path.endsWith('.css'))
      .map(path => outputFileSystem.readFileSync(path.join(outputPath, path)))
      .join('\n')}
    </style>
  </head>
  <body>
    <div id="app"></div>
    ${normalizeAssets(assetsByChunkName.main)
      .filter(path => path.endsWith('.js'))
      .map(path => `<script src="${path}"></script>`)
      .join('\n')}
  </body>
</html>
  `);
});

app.listen(3000, () => {
  console.log('app is running: ...');
});
