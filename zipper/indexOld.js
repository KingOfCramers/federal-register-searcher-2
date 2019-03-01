const fs = require("fs-extra");
const archiver = require("archiver");
const path = require("path");

const { today } = require("../keys/globals");
const config = require("../keys/config");
const { logger } = require("../logger");

const zipper = (settings) => {
  console.log("zipping files...\n");
  console.log(settings);
  
  const emptyFolder = path.join(__dirname, "source");

  const zipFile = settings.map((user) => { // Settings for specific user...
    
    let email = user.email;
    let fileName = email.substring(0, email.lastIndexOf("@"));
    
    if(user.searchDeps.length + user.fullDeps.length > 0){ // If the user is actually asking for files...
      
      // Create zipper...
      let archive = archiver("zip", {  zlib: { level: 9 } });
      archive.on('error', (err) => Promise.reject(err));
      let output = fs.createWriteStream(path.join(__dirname, "..", `${fileName}.zip`));
      output.on('close', () => logger.write('\n File zipped, ' + archive.pointer() + ' total bytes'));
      archive.pipe(output);

      // Add entire folders...
      if(user.fullDeps.length > 0){
        user.fullDeps.forEach(x => {
          let dir = x.dep;
          if(x.type == "other"){
            archive.directory(emptyFolder, dir);
            console.log(x)
            x.all.filter(file => file.substr(file.length -3, file.length) == "pdf").forEach(file => {
              archive.file(path.resolve(__dirname, "..", today, "other", dir, file), { name: `${dir}/${file}` })
            });
          } else {
            console.log(x)
            archive.directory(emptyFolder, dir);
            x.all.filter(file => file.substr(file.length -3, file.length) == "pdf").forEach(file => {
              archive.file(path.resolve(__dirname, "..", today, "rules", dir, file), { name: `${dir}/${file}` })
            });          
          }
        });
      }
      
      // Add specific files...
      if(user.searchDeps.length > 0){
        user.searchDeps.forEach(x => {
          let dir = x.dep;
          archive.directory(emptyFolder, dir);
  
          if(x.type == "other"){
            x.matches.forEach(match => {
              archive.file(path.resolve(__dirname, "..", today, "other", dir, match), { name: `${dir}/${match}` })
            });
          } else {
            x.matches.forEach(match => {
              archive.file(path.resolve(__dirname, "..", today, "rules", dir, match), { name: `${dir}/${match}` })
            });
          }
        });
      }
      
      // Finalize the archive...
      archive.finalize();
      return Promise.resolve({fileName, email });
    } else {
      return Promise.resolve({fileName: "X", email });
    }
  });

  return Promise.all(zipFile)
};

module.exports = zipper;