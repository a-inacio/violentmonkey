const fs = require('fs');
const path = require('path');

module.exports = async function(pluginConfig, context) {
  const { nextRelease, logger } = context;
  const version = nextRelease.version;

  const pkgPath = path.join(process.cwd(), 'package.json');
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
};