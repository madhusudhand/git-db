# git-db

Git as Database

## NOTE: 

Work in progress

## Usage

Git helper API should have the following method implementations

```js
class GitHelper {
  constructor(connection) {
    this.connection = connection;
  }

  async beginTransaction() {
    // return transaction object
  }

  async commitTransaction({ transaction }) {
    // you will receive the same transaction which is returned above.
    // write transaction commit logic here
  }

  async rollbackTransaction({ transaction }) {
    // write transaction rollback logic here
  }

  async readBranches({ transaction, repo }) {
    // read branches from DB and return the list
    // return branches;
  }

  async readHead({ transaction, repo, branch }) {
    // read head of the repo for the given branch from DB
    // return head;
  }

  async writeHead({ transaction, repo, branch, head }) {
    // write head info
    // return head;
  }

  async updateHead({ transaction, repo, branch, head }) {
    // update head info
    // return head;
  }

  async readBranch({ transaction, repo, branch }) {
    // read branch from db
    // return branchResult;
  }

  async createBranch({ transaction, repo, branch, head }) {
    // create logic for branch
    // return branchResult;
  }

  async readBlob({ transaction, repo, hash }) {
    // read logic for blob
    // return blob;
  }

  async writeBlob({ transaction, repo, blob }) {
    // write logic for blob
    // return blobResult;
  }

  async readTree({ transaction, repo, hash }) {
    // read tree
    // return tree;
  }

  async writeTree({ transaction, repo, tree }) {
    // write tree
    // return treeResult;
  }

  async readTreeObjects({ transaction, repo, tree }) {
    // read tree objects
    // return objects;
  }

  async writeTreeObjects({ transaction, repo, tree }) {
    // write tree objects
    // return treeObjects;
  }

  async readCommit({ transaction, repo, hash }) {
    // read commit
    // return commit;
  }

  async writeCommit({ transaction, repo, branch, commit }) {
    // write commit
    // return commitResult;
  }
}

module.exports = GitHelper;
```
