class Blob {
  async getBlob() {
    return {
      type: 'BLOB',
      mode: '100644',
      hash: '', // should get sha-1
      blob: '',
      size: '',
      name: '',
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
