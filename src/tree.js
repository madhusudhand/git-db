class Tree {
  async getTree() {
    const tree = {
      hash: '', // should get sha-1
      objects: [],
    };
    return tree;
  }

  async writeTree() {
    // write tree to db
  }

  async readTree() {
    // read tree from db
  }
}

module.exports = new Tree();
