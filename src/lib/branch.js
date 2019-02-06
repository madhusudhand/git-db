const gitConfig = require('./git-config');

class Branch {
  async createBranch({
    transaction, repo, source_branch, new_branch,
  }) {
    source_branch = source_branch || 'master';
    let b = await gitConfig.config.readBranch({ repo, branch: new_branch });
    if (!b) {
      b = await gitConfig.config.readBranch({ repo, branch: source_branch });
      if (!b) return;

      await gitConfig.config.createBranch({ repo, branch: new_branch, head: b.head });
    }
  }
}

module.exports = new Branch();
