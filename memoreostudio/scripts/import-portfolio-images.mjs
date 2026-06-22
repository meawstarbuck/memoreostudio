#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const categories = {
  couple: {
    prefix: "london-tower-bridge-couple-photoshoot",
    extension: ".jpeg",
  },
  solo: {
    prefix: "london-solo-lifestyle-photography-memoreo",
    extension: ".jpeg",
  },
  party: {
    prefix: "london-party-event-photography-memoreo",
    extension: ".jpg",
  },
  graduation: {
    prefix: "university-of-london-graduation-photographer-memoreo",
    extension: ".jpeg",
  },
};

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function usage() {
  console.log(`Usage:
  node scripts/import-portfolio-images.mjs --category couple [--apply]

Options:
  --category <name>   couple, solo, party, or graduation
  --source <dir>      Source folder. Default: image
  --start <number>    First output number. Default: next number in category
  --limit <number>    Import only the first N source images
  --move              Move files instead of copying them. Requires --apply
  --apply             Actually copy/move files and update data/portfolio.yaml

New entries are added newest-first to the top of their category in
data/portfolio.yaml, so higher-numbered images show first on the gallery page.

Examples:
  node scripts/import-portfolio-images.mjs --category couple
  node scripts/import-portfolio-images.mjs --category couple --start 36 --apply
  node scripts/import-portfolio-images.mjs --category solo --source image --apply
  node scripts/import-portfolio-images.mjs --category party --move --apply`);
}

function parseArgs(argv) {
  const options = {
    source: "image",
    apply: false,
    move: false,
    start: null,
    limit: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--apply") {
      options.apply = true;
    } else if (arg === "--move") {
      options.move = true;
    } else if (arg === "--category") {
      options.category = argv[++i];
    } else if (arg === "--source") {
      options.source = argv[++i];
    } else if (arg === "--start") {
      options.start = Number.parseInt(argv[++i], 10);
    } else if (arg === "--limit") {
      options.limit = Number.parseInt(argv[++i], 10);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function assertOptions(options) {
  if (options.help) {
    usage();
    process.exit(0);
  }

  if (!options.category || !categories[options.category]) {
    throw new Error("--category must be one of: couple, solo, party, graduation");
  }

  if (options.start !== null && (!Number.isInteger(options.start) || options.start < 1)) {
    throw new Error("--start must be a positive number");
  }

  if (options.limit !== null && (!Number.isInteger(options.limit) || options.limit < 1)) {
    throw new Error("--limit must be a positive number");
  }

  if (options.move && !options.apply) {
    throw new Error("--move requires --apply");
  }
}

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function getSourceImages(sourceDir) {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source folder does not exist: ${sourceDir}`);
  }

  return fs
    .readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => imageExtensions.has(path.extname(name).toLowerCase()))
    .sort(naturalCompare);
}

function getNextNumber(destinationDir, prefix) {
  if (!fs.existsSync(destinationDir)) {
    return 1;
  }

  const pattern = new RegExp(`^${escapeRegExp(prefix)}-(\\d+)\\.[^.]+$`);
  const numbers = fs
    .readdirSync(destinationDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.match(pattern)?.[1])
    .filter(Boolean)
    .map(Number);

  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getTargetExtension(sourceName, categoryExtension) {
  const sourceExtension = path.extname(sourceName).toLowerCase();

  if (sourceExtension === ".jpg" || sourceExtension === ".jpeg") {
    return categoryExtension;
  }

  return sourceExtension;
}

function buildImports(sourceDir, destinationDir, categoryConfig, options) {
  const sourceImages = getSourceImages(sourceDir);
  const selectedImages = options.limit ? sourceImages.slice(0, options.limit) : sourceImages;
  const firstNumber = options.start ?? getNextNumber(destinationDir, categoryConfig.prefix);

  return selectedImages.map((sourceName, index) => {
    const number = firstNumber + index;
    const extension = getTargetExtension(sourceName, categoryConfig.extension);
    const targetName = `${categoryConfig.prefix}-${number}${extension}`;

    return {
      sourceName,
      sourcePath: path.join(sourceDir, sourceName),
      targetName,
      targetPath: path.join(destinationDir, targetName),
    };
  });
}

function assertNoTargetConflicts(imports) {
  const conflicts = imports.filter((item) => fs.existsSync(item.targetPath));

  if (conflicts.length > 0) {
    throw new Error(
      `Target file already exists:\n${conflicts.map((item) => `  ${item.targetPath}`).join("\n")}`,
    );
  }
}

function updatePortfolioData(dataPath, category, targetNames) {
  const original = fs.readFileSync(dataPath, "utf8");
  const existingNames = new Set([...original.matchAll(/name:\s*"([^"]+)"/g)].map((match) => match[1]));
  const newestFirstNames = [...targetNames].reverse();
  const newEntries = newestFirstNames
    .filter((name) => !existingNames.has(name))
    .map((name) => `- name: "${name}"\n  category: "${category}"`)
    .join("\n");

  if (!newEntries) {
    return false;
  }

  const categoryLine = `category: "${category}"`;
  const firstCategoryIndex = original.indexOf(categoryLine);

  if (firstCategoryIndex === -1) {
    const nextContent = `${original.trimEnd()}\n\n${newEntries}\n`;
    fs.writeFileSync(dataPath, nextContent);
    return true;
  }

  const headerMarker = "\n# ---";
  const previousHeaderIndex = original.lastIndexOf(headerMarker, firstCategoryIndex);
  const headerStart = previousHeaderIndex === -1 ? 0 : previousHeaderIndex + 1;
  const headerEnd = original.indexOf("\n", headerStart);
  const insertIndex = headerEnd === -1 ? 0 : headerEnd + 1;
  const before = original.slice(0, insertIndex);
  const after = original.slice(insertIndex);
  const nextContent = `${before}${newEntries}\n${after}`;

  fs.writeFileSync(dataPath, nextContent);
  return true;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  assertOptions(options);

  const siteRoot = process.cwd();
  const categoryConfig = categories[options.category];
  const sourceDir = path.resolve(siteRoot, options.source);
  const destinationDir = path.resolve(siteRoot, "assets", "images", "portfolio", options.category);
  const dataPath = path.resolve(siteRoot, "data", "portfolio.yaml");
  const imports = buildImports(sourceDir, destinationDir, categoryConfig, options);

  if (imports.length === 0) {
    console.log(`No source images found in ${sourceDir}`);
    return;
  }

  assertNoTargetConflicts(imports);

  console.log(`${options.apply ? "Importing" : "Previewing"} ${imports.length} ${options.category} image(s):`);
  for (const item of imports) {
    console.log(`  ${item.sourceName} -> ${path.relative(siteRoot, item.targetPath)}`);
  }

  if (!options.apply) {
    console.log("\nDry run only. Add --apply to copy files and update data/portfolio.yaml.");
    return;
  }

  fs.mkdirSync(destinationDir, { recursive: true });

  for (const item of imports) {
    if (options.move) {
      fs.renameSync(item.sourcePath, item.targetPath);
    } else {
      fs.copyFileSync(item.sourcePath, item.targetPath);
    }
  }

  const updatedData = updatePortfolioData(
    dataPath,
    options.category,
    imports.map((item) => item.targetName),
  );

  console.log(`\nDone. ${options.move ? "Moved" : "Copied"} ${imports.length} image(s).`);
  console.log(updatedData ? "Updated data/portfolio.yaml." : "No new data/portfolio.yaml entries were needed.");
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
