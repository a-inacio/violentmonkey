const fs = require('fs');
const path = require('path');
const github = require('@actions/github');

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("GITHUB_TOKEN not set");
  process.exit(1);
}

const octokit = github.getOctokit(token);
const { context } = github;

// Get all subfolders in scripts/
const scriptFolders = fs.readdirSync('scripts').filter(f =>
  fs.statSync(path.join('scripts', f)).isDirectory()
);

(async () => {
  for (const folder of scriptFolders) {
    const assetPath = path.join('scripts', folder, 'src', 'main.user.js');
    if (!fs.existsSync(assetPath)) continue;

    // Get the latest release
    const release = await octokit.rest.repos.getLatestRelease({
      owner: context.repo.owner,
      repo: context.repo.repo
    });

    // Upload the script as release asset
    await octokit.rest.repos.uploadReleaseAsset({
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
})();
