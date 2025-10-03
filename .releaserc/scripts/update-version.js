// .releaserc/scripts/update-version.js
const fs = require('fs');
const path = require('path');

module.exports = {
  prepare: async (pluginConfig, context) => {
    const { nextRelease, logger, cwd } = context;
    const version = nextRelease.version;
    const scriptDir = process.env.SCRIPT_FOLDER || cwd;

    try {
      // Update package.json version
      const pkgPath = path.join(scriptDir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = require(pkgPath);
        pkg.version = version;
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
        logger.log(`Updated ${pkg.name} version to ${version} in package.json`);
      } else {
        logger.log(`No package.json found in ${scriptDir}, skipping version update.`);
      }

      // Generate release-ready dist/main.user.js with dynamic headers
      const srcPath = path.join(scriptDir, 'src', 'main.js');
      if (!fs.existsSync(srcPath)) {
        logger.log(`No main.js in ${scriptDir}, skipping.`);
        return;
      }

      // Read source
      const srcContent = fs.readFileSync(srcPath, 'utf8');

      // Create dist folder if it doesn't exist
      const distDir = path.join(scriptDir, 'dist');
      if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

      // Build userscript header
      const pkg = require(path.join(scriptDir, 'package.json'));
      const header = `// ==UserScript==
// @name        ${pkg.violentmonkey?.name || pkg.name}
// @namespace   https://github.com/a-inacio/violentmonkey
// @match       ${pkg.violentmonkey?.match?.join('\n// @match       ')}
// @grant       none
// @version     ${version}
// @author      António Inácio
// @description ${pkg.description || ''}
// @updateURL   https://github.com/a-inacio/violentmonkey/releases/latest/download/${pkg.name}.user.js
// @downloadURL https://github.com/a-inacio/violentmonkey/releases/latest/download/${pkg.name}.user.js
// ==/UserScript==\n\n`;

      const releaseContent = header + srcContent;

      const releaseFile = path.join(distDir, `${pkg.name}.user.js`);
      fs.writeFileSync(releaseFile, releaseContent, 'utf8');

      logger.log(`Generated release file: ${releaseFile}`);
    } catch (err) {
      logger.error(`Error generating release file: ${err.message}`);
      throw err;
    }
  }
};
