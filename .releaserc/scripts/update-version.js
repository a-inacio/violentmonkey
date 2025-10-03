const fs = require('fs');
const path = require('path');

module.exports = {
  // semantic-release calls the plugin's "verifyConditions", "prepare", or "publish" methods
  prepare: async (pluginConfig, context) => {
    const { nextRelease, logger, cwd } = context;
    const version = nextRelease.version;

    try {
      const pkgPath = path.join(cwd, 'package.json');
      if (!fs.existsSync(pkgPath)) {
        logger.log(`No package.json found in ${cwd}, skipping.`);
        return;
      }

      const pkg = require(pkgPath);

      const filePath = path.join(cwd, 'src', 'main.user.js');
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
      throw err;
    }
  }
};
