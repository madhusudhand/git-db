const blob = require('./lib/blob');
const tree = require('./lib/tree');
const commit = require('./lib/commit');
const gitConfig = require('./lib/git-config');

module.exports = {
  configure: (config) => {
    gitConfig.config = config;
  },
  blob,
  tree,
  commit,
};
