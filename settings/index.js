const fs = require("fs-extra");
const { readdirSync, statSync } = fs;
const path = require("path");
const { join } = path;
const today = require("../keys/globals").today;

const settingScraper = () => new Promise((resolve, reject) => {
  console.log("reading PDF paths...\n")
  const ruleFolderNames = readdirSync(path.resolve(__dirname, "../", today, "rules")).filter(f => statSync(join(__dirname, "../", today, "rules", f)).isDirectory());
  const otherFolderNames = readdirSync(path.resolve(__dirname, "../", today, "other")).filter(f => statSync(join(__dirname, "../", today, "other", f)).isDirectory());
  resolve({ ruleFolderNames, otherFolderNames });
});

module.exports = settingScraper
