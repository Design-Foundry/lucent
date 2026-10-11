// Keeps every Lucent package on the design system version (the root package.json version).
//   node scripts/sync-version.mjs           write the version into every manifest
//   node scripts/sync-version.mjs --check   fail when a manifest or the git tag differs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifests = ["styles/package.json", "packages/angular/package.json"];
const lucentPackage = /^@design-foundry\/lucent-/;
const dependencySections = ["dependencies", "peerDependencies", "devDependencies"];

const read = (path) => JSON.parse(readFileSync(join(root, path), "utf8"));
const version = read("package.json").version;
const check = process.argv.includes("--check");
const problems = [];

for (const path of manifests) {
  const manifest = read(path);
  if (manifest.version !== version) problems.push(`${path}: version ${manifest.version}, expected ${version}`);
  manifest.version = version;
  for (const section of dependencySections) {
    for (const name of Object.keys(manifest[section] ?? {})) {
      if (!lucentPackage.test(name)) continue;
      if (manifest[section][name] !== version) problems.push(`${path}: ${section}.${name} is ${manifest[section][name]}, expected ${version}`);
      manifest[section][name] = version;
    }
  }
  if (!check) writeFileSync(join(root, path), JSON.stringify(manifest, null, 2) + "\n");
}

const tag = process.env.GITHUB_REF_TYPE === "tag" ? process.env.GITHUB_REF_NAME : undefined;
if (tag !== undefined && tag !== `v${version}`) problems.push(`tag ${tag}, expected v${version}`);

if (check && problems.length > 0) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(check ? `all packages are on ${version}` : `wrote ${version} to ${manifests.length} manifests`);
