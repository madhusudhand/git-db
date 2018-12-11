const gitUtil = require('./git-util');
const gitConfig = require('./git-config');

class Blob {
  async get() {
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

  async write(blob) {
    const b = await gitConfig.config.readBlob({ hash: blob.hash });
    if (!b) {
      await gitConfig.config.writeBlob({ blob });
    }
  }

  async read(hash) {
    const blob = await gitConfig.config.readBlob({ hash }); // returns compressed content
    blob.blob = await gitUtil.uncompress(blob.blob_content);
    return blob;
  }
}

module.exports = new Blob();
