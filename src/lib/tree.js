const gitUtil = require('./git-util');
const gitBlob = require('./blob');

class Tree {
  async getTree() {
    const tree = {
      hash: '',
      objects: [],
    };

    for (const obj of objects) {
      const blob = await gitBlob.getBlob(obj.name, obj.content);
      blob.meta = obj.meta;
      tree.objects.push(blob);
    }

    const tree_str = tree.objects.map(d => `${d.mode} ${d.type.toLowerCase()} ${d.hash} ${d.name}`).join('\n');

    tree.hash = await gitUtil.getHash(tree_str);
  
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
