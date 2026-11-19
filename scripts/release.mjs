#!/usr/bin/env node

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const pkgPath = path.join(rootDir, "package.json");
const gradlePath = path.join(rootDir, "android", "app", "build.gradle");

function runCommand(command) {
  console.log(`> ${command}`);
  execSync(command, { cwd: rootDir, stdio: "inherit" });
}

async function main() {
  console.log("=========================================");
  console.log("🏷️  FoxTrack Release & Tag Pipeline");
  console.log("=========================================");

  // 1. Read current version
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const currentVersion = pkg.version || "1.0.0";
  console.log(`Current version: ${currentVersion}`);

  // 2. Get new version (from CLI arg or interactive prompt)
  let targetVersion = process.argv[2];

  if (!targetVersion) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    targetVersion = await rl.question(`\nEnter new version (current is ${currentVersion}): `);
    rl.close();
  }

  targetVersion = targetVersion?.trim();
  if (!targetVersion) {
    console.error("❌ Version cannot be empty. Aborted.");
    process.exit(1);
  }

  // Normalize: remove leading 'v' if present for semantic version
  const cleanVersion = targetVersion.startsWith("v") ? targetVersion.slice(1) : targetVersion;

  if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/.test(cleanVersion)) {
    console.error(
      `❌ Invalid semantic version format: "${targetVersion}". Example: 1.1.0 or 1.1.0-beta.1`,
    );
    process.exit(1);
  }

  const tagName = `v${cleanVersion}`;

  // 3. Check for existing git tag
  try {
    const existingTags = execSync("git tag -l", { encoding: "utf8" })
      .split("\n")
      .map((t) => t.trim());
    if (existingTags.includes(tagName)) {
      console.error(`❌ Git tag "${tagName}" already exists! Please choose a newer version.`);
      process.exit(1);
    }
  } catch {
    // Continue if tag lookup fails
  }

  console.log(`\n📦 Preparing Release: ${tagName}`);

  // 4. Update package.json
  console.log(`- Updating package.json to version ${cleanVersion}...`);
  pkg.version = cleanVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");

  // 5. Update android/app/build.gradle (versionName & versionCode)
  console.log("- Updating android/app/build.gradle...");
  let gradleContent = fs.readFileSync(gradlePath, "utf8");

  const versionCodeMatch = gradleContent.match(/versionCode\s+(\d+)/);
  const currentCode = versionCodeMatch ? parseInt(versionCodeMatch[1], 10) : 1;
  const nextCode = currentCode + 1;

  gradleContent = gradleContent.replace(/versionCode\s+\d+/, `versionCode ${nextCode}`);
  gradleContent = gradleContent.replace(/versionName\s+"[^"]+"/, `versionName "${cleanVersion}"`);
  fs.writeFileSync(gradlePath, gradleContent, "utf8");

  console.log(
    `  ↳ Android versionCode: ${currentCode} -> ${nextCode}, versionName: "${cleanVersion}"`,
  );

  // 6. Run verification suite before committing
  console.log("\n🧪 Running verification suite (format, lint, tsc, tests)...");
  try {
    runCommand("pnpm format:check");
    runCommand("pnpm lint");
    runCommand("pnpm exec tsc --noEmit");
    runCommand("pnpm test");
  } catch (error) {
    console.error("\n❌ Verification suite failed! Reverting version files...");
    runCommand("git checkout -- package.json android/app/build.gradle");
    process.exit(1);
  }

  // 7. Git commit, tag, and push
  try {
    console.log("\n📌 Staging version changes...");
    runCommand("git add package.json android/app/build.gradle");

    console.log(`📌 Committing: "chore(release): ${tagName}"...`);
    runCommand(`git commit -m "chore(release): ${tagName}"`);

    console.log(`📌 Creating annotated tag: "${tagName}"...`);
    runCommand(`git tag -a "${tagName}" -m "Release ${tagName}"`);

    console.log("\n🚀 Pushing commit and tags to remote...");
    runCommand("git push");
    runCommand(`git push origin "${tagName}"`);

    console.log("\n=========================================");
    console.log(`🎉 Release ${tagName} successfully tagged and pushed!`);
    console.log("🤖 GitHub Actions CI will now build the Android APK");
    console.log("   and attach it to the GitHub Release for download.");
    console.log("=========================================\n");
  } catch (error) {
    console.error("\n❌ Git operation failed:", error.message || error);
    process.exit(1);
  }
}

main();
