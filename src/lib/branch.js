const gitConfig = require('./git-config');

class Branch {
  async createBranch({ source_branch, new_branch }) {
    source_branch = source_branch || 'master';
    let b = await gitConfig.config.readBranch({ branch: new_branch });
    if (!b) {
      b = await gitConfig.config.readBranch({ branch: source_branch });
      if (!b) return;

      await gitConfig.config.createBranch({ branch: new_branch, head: b.head });
    }
  }
}

module.exports = new Branch();
