const gitUtil = require('./git-util');

module.exports = {
  config: {
    async readBlob({ hash }) {
      const blob_content = await gitUtil.compress('hello world!!');
      return {
        blob_content,
      };
    },
    async writeBlob({ blob }) {
      // do nothing
    }
  }
};
