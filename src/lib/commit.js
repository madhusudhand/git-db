const gitUtil = require('./git-util');
const gitTree = require('./tree');

class Commit {

  async get(objects, parent, author, committer, comment) {
    const tree = await gitTree.get(objects);
    const author_timestamp = Date.now();
    const committer_timestamp = author_timestamp;

    const commit_attrs = [`tree ${tree.hash}`];
    if (parent) {
      commit_attrs.push(`parent ${parent_hash}`);
    }
    commit_attrs.push(`author ${author} ${author_timestamp}`);
    commit_attrs.push(`committer ${committer} ${committer_timestamp}`);
    commit_attrs.push('');
    commit_attrs.push(`comment ${comment}`);

    const commit_str = commit_attrs.join('\n');
    const commit_hash = await gitUtil.getHash(commit_str);

    return {
      commit_hash,
      tree_hash: tree.hash,
      parent1: parent || null,
      parent2: null,
      author,
      author_timestamp,
      committer,
      committer_timestamp,
      comment,
      tree,
    };
  }

  async write() {
    // write commit to db
  }

  async read() {
    // read commit from db
  }
}

module.exports = new Commit();
