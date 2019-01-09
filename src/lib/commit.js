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

  async read({ repo, hash }) {
    // read the commit at given hash
    const commit = await gitConfig.config.readCommit({ repo, hash });

    if (!commit) {
      return null;
    }

    // read corresponding commit tree
    const tree = await gitTree.read({ repo, hash: commit.tree_hash });

    return {
      hash: commit.commit_hash,
      author: commit.author,
      author_timestamp: commit.author_timestamp,
      committer: commit.committer,
      committer_timestamp: commit.committer_timestamp,
      commit_message: commit.commit_message || '',
      tree,
      parent1: commit.parent1 || null,
      parent2: commit.parent2 || null,
    };
  }
}

module.exports = new Commit();
