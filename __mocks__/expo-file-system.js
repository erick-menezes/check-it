class File {
  constructor(...segments) {
    this.uri = segments.join('/');
  }
  delete() {}
}

module.exports = { File };
