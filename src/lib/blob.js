const gitUtil = require('./git-util');
const gitConfig = require('./git-config');

class Blob {
  async get(filepath, content) {
    const hash = await gitUtil.getHash(content);
    const blob = await gitUtil.compress(content);

    return {
      type: 'BLOB',
      mode: '100644',
      hash,
      blob,
      size: content.length,
      name: filepath,
    };
  }

  async write({ repo, blob }) {
    const b = await gitConfig.config.readBlob({ repo, hash: blob.hash });
    if (!b) {
      await gitConfig.config.writeBlob({ repo, blob });
    }
  }

  async read({ repo, hash }) {
    const blob = await gitConfig.config.readBlob({ repo, hash });
    blob.blob = await gitUtil.uncompress(blob.blob_content);
    return blob;
  }
}

module.exports = new Blob();
