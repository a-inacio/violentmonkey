// .releaserc.js
const path = require('path');

module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: path.resolve(process.cwd(), 'CHANGELOG.md')
      }
    ],
    ['./.releaserc/scripts/update-version.js', {}],
    [
      '@semantic-release/git',
      {
        assets: [
          'src/main.user.js',
          'CHANGELOG.md',
          'package.json'
        ],
        message: 'chore(release): ${nextRelease.version} [skip ci]'
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: 'src/main.user.js'
      }
    ]
  ]
};
