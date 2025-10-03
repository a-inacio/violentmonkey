// .releaserc.js
const path = require('path');

// Use SCRIPT_FOLDER from env, fallback to repo root
const scriptDir = process.env.SCRIPT_FOLDER || process.cwd();

module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: path.resolve(scriptDir, 'CHANGELOG.md')
      }
    ],
    ['./.releaserc/scripts/update-version.js', {}],
    [
      '@semantic-release/git',
      {
        assets: [
          'src/main.js',
          'CHANGELOG.md',
          'package.json'
        ],
        message: 'chore(release): ${nextRelease.version} [skip ci]'
      }
    ],
    [
      '@semantic-release/github',
      {
        assets: 'src/main.js'
      }
    ]
  ]
};
