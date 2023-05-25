'use strict';

const React = require('react');
const { renderToString } = require('react-dom/server');
const { ChunkExtractor, ChunkExtractorManager } = require('@loadable/server');
const chalk = require('chalk');
const vm = require('vm');

module.exports = ({ request, response, bundles }) => {
  const { bundle, clientManifest } = bundles;
  console.log(chalk.bgYellow('...wait   '), 'render start...');
  const file = bundle.files[bundle.entry];
  const sandbox = {
    console,
    module,
    require,
  };
  vm.runInNewContext(file, sandbox);
  const serverEntry = sandbox.module.exports;

  let extractor = new ChunkExtractor({
    stats: clientManifest,
    entrypoints: ['main'],
  });

  let component = serverEntry.createApp();

  let root = renderToString(
    React.createElement(ChunkExtractorManager, { extractor }, component)
  );

  // console.log(clientManifest, '=>');
  console.log(extractor.getScriptTags(), 'root');
  // const root = renderToString(component);
  return root;
};
