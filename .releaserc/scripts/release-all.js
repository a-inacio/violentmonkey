// .releaserc/scripts/release-all.js
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Parse command line argument for dry run
// Default: true (dry-run)
const dryRun = process.argv[2] !== "false";
const dryRunFlag = dryRun ? "--dry-run" : "";

// Root of the repository 
const repoRoot = path.resolve(__dirname, "../../");

// Path to the scripts folder
const scriptsRoot = path.join(repoRoot, "scripts");

// Find all subdirectories in scriptsRoot
const dirs = fs.readdirSync(scriptsRoot)
  .map(name => path.join(scriptsRoot, name))
  .filter(p => fs.statSync(p).isDirectory());

// Exit if no scripts
if (dirs.length === 0) {
  console.log("No script folders found, skipping release");
  process.exit(0);
}

// Loop over each directory and run semantic-release from repo root
dirs.forEach(dir => {
  console.log(`\nReleasing in ${dir}`);

  // Set SCRIPT_FOLDER so update-version plugin knows which script to update
  const env = { ...process.env, SCRIPT_FOLDER: dir };

  execSync(
    `npx semantic-release --extends "${path.join(repoRoot, ".releaserc.json")}" ${dryRunFlag}`,
    { stdio: "inherit", cwd: repoRoot, env }
  );
});
