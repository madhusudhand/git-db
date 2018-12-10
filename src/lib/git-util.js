const crypto = require('crypto');
const zlib = require('zlib');
const promisify = require('util.promisify');

module.exports = {
  getHash,
  compress,
  uncompress,
};

async function getHash(content) {
  return crypto.createHash('sha1')
    .update(content)
    .digest('hex');
}

async function compress(content) {
  const gzip = promisify(zlib.gzip);
  const buffer = await gzip(content);
  return buffer;
}

async function uncompress(buffer) {
  const gunzip = promisify(zlib.gunzip);
  const _buffer = await gunzip(buffer);
  return _buffer.toString();
}
