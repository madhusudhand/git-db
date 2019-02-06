const gitUtil = require('./git-util');
const gitTree = require('./tree');
const gitConfig = require('./git-config');

class Commit {
  async getFileDiff(repo, head) {
    const base_commit = this.read(repo, head);
  }

  async get(objects, {
    parent, author, committer, comment,
  }) {
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

  async write(repo, { branch, head, objects, author, committer, comment }, transaction) {
    const implicitTransaction = !transaction;
    transaction = transaction || await gitConfig.config.beginTransaction();

    try {
      const commit = await this.get(objects, { author, committer, comment });
      await gitTree.write({ transaction, repo, tree: commit.tree });

      const currentHead = await gitConfig.config.readHead({ transaction, repo, branch });

      if (head !== currentHead) {
        // throw error: head moved and so can't commit
        throw 'head is not valid';
      }

      await gitConfig.config.writeCommit({
        transaction,
        repo,
        branch,
        commit: {
          hash: commit.commit_hash,
          parent1: head,
          parent2: null,
          tree: commit.tree_hash,
          author: commit.author,
          author_timestamp: commit.author_timestamp,
          committer: commit.committer,
          committer_timestamp: commit.committer_timestamp,
          commit_message: commit.comment,
        },
      });

      if (!head) {
        await gitConfig.config.writeHead({
          transaction, repo, branch, head: commit.commit_hash,
        });
      } else {
        await gitConfig.config.updateHead({
          transaction, repo, branch, head: commit.commit_hash,
        });
      }

      if (implicitTransaction) {
        await gitConfig.config.commitTransaction({ transaction });
      }
      return commit;
    } catch (error) {
      if (implicitTransaction) {
        await gitConfig.config.rollbackTransaction({ transaction, error });
      }
      throw error;
    }
  }

  /*
   * Params: repo, hash
   * hash: can be a commit hash or a branch name
   */
  async read(repo, branch) {
    const transaction = await gitConfig.config.beginTransaction();

    try {
      let head;
      // check if the hash is a branch name
      if (branch) {
        const branches = await gitConfig.config.readBranches({ transaction, repo });
        const index = branches.findIndex(b => b.branch === branch);
        if (index > -1) {
          head = branches[index].head;
        }
      }

      // if branch not found, get the head of default branch
      if (!head) {
        head = await gitConfig.config.readHead({ transaction, repo, branch: 'master' });
      }

      // if master isn't found, return
      if (!head) {
        return null;
      }

      // read the commit at given hash
      const commit = await gitConfig.config.readCommit({ transaction, repo, hash: head });

      if (!commit) {
        return null;
      }

      // read corresponding commit tree
      const tree = await gitTree.read({ transaction, repo, hash: commit.tree_hash });
      await gitConfig.config.commitTransaction({ transaction });

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
        meta: commit.meta || null,
      };
    } catch (e) {
      await gitConfig.config.rollbackTransaction({ transaction });
      return null;
    }
  }
}

module.exports = new Commit();
