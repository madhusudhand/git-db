const gitUtil = require('./git-util');

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

  async read() {
    // read the object from db
  }

  async write() {
    // write the object to db
  }
}

module.exports = new Blob();
