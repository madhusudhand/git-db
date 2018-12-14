const gitUtil = require('./git-util');
const gitBlob = require('./blob');
const gitConfig = require('./git-config');

class Tree {
  async get() {
    const tree = {
      hash: '',
      objects: [],
    };

    for (const obj of objects) {
      const blob = await gitBlob.get(obj.name, obj.content);
      blob.meta = obj.meta;
      tree.objects.push(blob);
    }

    const tree_str = tree.objects.map(d => `${d.mode} ${d.type.toLowerCase()} ${d.hash} ${d.name}`).join('\n');

    tree.hash = await gitUtil.getHash(tree_str);
  
    return tree;
  }

  async write() {
    // write tree to db
  }

  async read(hash) {
    const tree = await gitConfig.config.readTree({ hash });
    if (!tree) {
      return null;
    }

    tree.objects = [];
    const objects = await gitConfig.config.readTreeObjects({ tree });

    if (Array.isArray(objects)) {
      for (const obj of objects) {
        const blob = await gitBlob.read({ hash: obj.hash });
        tree.objects.push({
          hash: obj.hash,
          name: obj.name,
          content: blob.blob,
          type: obj.type,
          mode: obj.mode,
          meta: obj.meta,
        });
      }
    }

    return tree;
  }
}

module.exports = new Tree();
