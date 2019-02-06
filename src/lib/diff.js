const commit = require('./commit');
const diffUtil = require('../utils/diff');

class Diff {
  async getDiff(repo, branch, objects) {
    const base_commit = await commit.read(repo, branch);
    const originalObjects = base_commit.tree.objects;

    const diffResult = {};
    const filediff = diffUtil.diff_patch(originalObjects.map(o => o.name), objects.map(o => o.name));

    // console.log(filediff);

    if (filediff.length !== 0) {
      objects.forEach((obj) => {
        const index = originalObjects.findIndex(o => o.name === obj.name);
        const original = originalObjects[index].content.split('\n');
        const updated = obj.content.split('\n');

        diffResult[obj.name] = diffUtil.diff_comm(original, updated);
      });
    }

    return diffResult;
  }
}

module.exports = new Diff();
