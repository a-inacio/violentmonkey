// .releaserc/scripts/update-version.js

const fs = require('fs');
const path = require('path');

module.exports = async function updateVersion(pluginConfig, context) {
  const { nextRelease, logger } = context;
  const version = nextRelease.version;

  try {
    const pkgPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(pkgPath)) {
      logger.log(`No package.json found in ${process.cwd()}, skipping.`);
      return;
    }

    const pkg = require(pkgPath);

    const filePath = path.join(process.cwd(), 'src', 'main.user.js');
    if (!fs.existsSync(filePath)) {
      logger.log(`No main.user.js in ${pkg.name}, skipping.`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/(@version\s+)(\S+)/, `$1${version}`);
    fs.writeFileSync(filePath, content, 'utf8');

    logger.log(`Updated ${pkg.name} to version ${version}`);
  } catch (err) {
    logger.error(`Error updating version: ${err.message}`);
    throw err; // rethrow to stop release if needed
  }
};
