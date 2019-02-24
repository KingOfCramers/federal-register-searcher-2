const fs = require("fs-extra");
const util = require("util");
const path = require("path");
const { today } = require("../keys/globals");
let readFile = util.promisify(fs.readFile);

const searchDocs = async (type, dep, keywords) => {
  
  keywords.map(x => x.toLowerCase());
  
  const readDocs = async (t, d) => {
    let folderPath = path.resolve(__dirname, "..", today, t, d);
    let matches = [];

    let allFiles = await fs.readdir(folderPath);
    txtFiles = allFiles.filter((name) => name.slice(name.length -3, name.length) == "txt");

    let promises = txtFiles.map(async(tName) => {
        let content = await readFile(path.resolve(folderPath, tName), "utf-8");
        return Promise.resolve({ content, tName });
    });

    return Promise.all(promises); 
  };

  let content = await readDocs(type, dep);

  let res = {
    type,
    dep,
    search: keywords,
    matches: content.filter(x => {
      let vals = x.content.split("','");
      vals = vals.map(x => x.toLowerCase());
      return vals.some(r => keywords.includes(r));
    }).map(x => x.tName.substr(0, x.tName.length - 3).concat("pdf"))
  };

  return Promise.resolve(res);

};

const fetchDocs = async (type, dep) => {
  let fetched = await fs.readdir(path.resolve(__dirname, "..", today, type, dep));
  all = fetched.filter(x => x.substr(x.length - 3, x.length) == "pdf");
  return Promise.resolve({ type, dep, all });
}

module.exports = { searchDocs, fetchDocs };