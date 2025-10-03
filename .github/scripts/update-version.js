const fs = require('fs');
const path = require('path');

const scriptsDir = path.resolve(__dirname, '../../scripts');

const scriptFolders = fs.readdirSync(scriptsDir).filter(f =>
  fs.statSync(path.join(scriptsDir, f)).isDirectory()
);

scriptFolders.forEach(folder => {
  const pkgPath = path.join(scriptsDir, folder, 'package.json');
  const pkg = require(pkgPath);
  const version = pkg.version;

  const filePath = path.join(scriptsDir, folder, 'src', 'main.user.js');
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/(@version\s+)(\S+)/, `$1${version}`);
  fs.writeFileSync(filePath, content, 'utf8');

  console.log(`Updated ${folder} to version ${version}`);
});
