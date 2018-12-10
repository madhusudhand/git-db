const gitUtil = require('./git-util');

class Blob {
  async getBlob() {
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

  async readBlob() {
    // read the object from db
  }

  async writeBlob() {
    // write the object to db
  }
}

module.exports = new Blob();
