// .releaserc/scripts/update-version.js
const fs = require('fs');
const path = require('path');

module.exports = {
  prepare: async (pluginConfig, context) => {
    const { nextRelease, logger, cwd } = context;
    const version = nextRelease.version;

    const scriptDir = process.env.SCRIPT_FOLDER || cwd;

    try {
      const pkgPath = path.join(scriptDir, 'package.json');
      if (!fs.existsSync(pkgPath)) {
        logger.log(`No package.json found in ${scriptDir}, skipping.`);
        return;
      }

      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.version = version;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');

      logger.log(`Bumped ${pkg.name || scriptDir} package.json to ${version}`);
    } catch (err) {
      logger.error(`Error updating package.json in ${scriptDir}: ${err.message}`);
      throw err;
    }
  }
};