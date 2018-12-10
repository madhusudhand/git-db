class Commit {
  async getCommit() {
    return {
      commit_hash: '',
      tree_hash: '',
      parent1: '',
      parent2: '',
      author: '',
      author_timestamp: '',
      committer: '',
      committer_timestamp: '',
      comment: '',
      tree: '',
    };
  }

  async writeCommit() {
    // write commit to db
  }

  async readCommit() {
    // read commit from db
  }
}

module.exports = new Commit();
