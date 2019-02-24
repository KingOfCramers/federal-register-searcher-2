const fs = require("fs-extra");
const path = require("path");

const { today } = require("../keys/globals");

const zipper = (settings) => {
  console.log("zipping files...\n");
  console.log(settings);

  const zipFile = settings.map((user) => { // Settings for specific user...
    
    let email = user.email;
    let folderName = email.substring(0, email.lastIndexOf("@"));
    
    if(user.searchDeps.length + user.fullDeps.length > 0){ // If the user is actually asking for files...
     
      fs.mkdirSync(path.resolve(__dirname, `${folderName}`));

      // Add entire folders...
      if(user.fullDeps.length > 0){
        user.fullDeps.forEach(x => {
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