const gitUtil = require('./git-util');
const gitBlob = require('./blob');
const gitConfig = require('./git-config');

class Tree {
  async get(objects) {
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

  async write({ transaction, repo, tree }) {
    const objects = [];
    for (const obj of tree.objects) {
      if (obj.type === 'BLOB') {
        await gitBlob.write({ transaction, repo, blob: obj });
      }
      objects.push({
        mode: obj.mode,
        type: obj.type,
        hash: obj.hash,
        name: obj.name,
        meta: obj.meta,
      });
    }

    await this._write(transaction, repo, {
      hash: tree.hash,
      objects,
    });
  }

  async _write(transaction, repo, tree) {
    const t = await gitConfig.config.readTree({ transaction, repo, hash: tree.hash });
    if (!t) {
      const tree_id = await gitConfig.config.writeTree({ transaction, repo, tree });
      tree.meta = { id: tree_id };
      await gitConfig.config.writeTreeObjects({ transaction, repo, tree });
    }
  }

  async read({ transaction, repo, hash }) {
    const tree = await gitConfig.config.readTree({ transaction, repo, hash });
    if (!tree) {
      return null;
    }

    tree.objects = [];
    const objects = await gitConfig.config.readTreeObjects({ transaction, repo, tree });

    if (Array.isArray(objects)) {
      for (const obj of objects) {
        const blob = await gitBlob.read({ transaction, repo, hash: obj.hash });
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
