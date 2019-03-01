const fs = require("fs-extra");
const path = require("path");
const util = require("util");
const mkdir = util.promisify(fs.mkdir);

const { today } = require("../keys/globals");

let createFolders = async (departments, folderName) => { // Returns array of all promises...
  const all = departments.map(dep => { // This must return promises...
    return mkdir(path.resolve(__dirname, folderName, dep));
  });

  const allDepartments = await Promise.all(all); // Await all departments...
  return allDepartments;
};

const zipper = (settings) => {

  const zipFile = settings.map(({ email, fullDeps, searchDeps }) => { // Create promise for each specific user...
    if(searchDeps.length + fullDeps.length > 0){ // If the user is actually asking for files...
      
      let folderName = email.substring(0, email.lastIndexOf("@"));
      fs.mkdirSync(path.resolve(__dirname, `${folderName}`)); // Make directory for user in current directory...
      
      if(fullDeps.length > 0){ // If user is asking for full info...
        let folders = createFolders(fullDeps, folderName);
        fullDeps.forEach(x => {
          let dir = x.dep;
          fs.mkdirSync(path.resolve(__dirname, folderName, dir));
          if(x.type == "other"){
            x.all.filter(file => file.substr(file.length -3, file.length) == "pdf").forEach(file => {
              fs.copyFile(path.resolve(__dirname, "..", today, "other", dir, file), path.resolve(__dirname, folderName, dir, file), (err) => {
                if (err) throw err;
                return;
              });
            });
          } else {
            x.all.filter(file => file.substr(file.length -3, file.length) == "pdf").forEach(file => {
              fs.copyFile(path.resolve(__dirname, "..", today, "rules", dir, file), path.resolve(__dirname, folderName, dir, file), (err) => {
                if (err) throw err;
                return;
              });
            });
          };
        });
      }
  
      return Promise.resolve({ folderName, email });
    } else {
      return Promise.resolve({ folderName: "X", email });
    }
  });

  return Promise.all(zipFile)
};

module.exports = zipper;