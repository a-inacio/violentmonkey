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
  .filter(p => fs.statSync(p).isDirectory() && p !== path.join(scriptsRoot, "release-all.js"));

if (dirs.length === 0) {
  console.log("No script folders found, skipping release");
  process.exit(0);
}

// Loop over each directory and run semantic-release
dirs.forEach(dir => {
  console.log(`\nReleasing in ${dir}`);
  execSync(
    `npx semantic-release --extends "${path.resolve(__dirname, "../../.releaserc.json")}" --cwd "${dir}" ${dryRunFlag}`,
    { stdio: "inherit" }
  );
});
