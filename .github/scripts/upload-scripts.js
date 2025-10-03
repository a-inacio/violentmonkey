const fs = require('fs');
const path = require('path');

module.exports = async function ({ github, context, core }) {
  // Get all subfolders in scripts/
  const scriptFolders = fs.readdirSync('scripts').filter(f =>
    fs.statSync(path.join('scripts', f)).isDirectory()
  );

  if (scriptFolders.length === 0) {
    console.log("No script folders found, skipping upload.");
    return;
  }

  for (const folder of scriptFolders) {
    const assetPath = path.join('scripts', folder, 'src', 'main.user.js');
    if (!fs.existsSync(assetPath)) {
      console.log(`No main.user.js in ${folder}, skipping.`);
      continue;
    }

    // Get latest release
    const release = await github.rest.repos.getLatestRelease({
      owner: context.repo.owner,
      repo: context.repo.repo
    });

    // Upload the asset
    await github.rest.repos.uploadReleaseAsset({
      owner: context.repo.owner,
      repo: context.repo.repo,
      release_id: release.data.id,
      name: `${folder}.user.js`,
      data: fs.readFileSync(assetPath),
      headers: {
        'content-type': 'application/javascript'
      }
    });

    console.log(`Uploaded ${folder}.user.js to release`);
  }
};
