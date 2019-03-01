const path = require("path");
const util = require("util");
const recursive = require("recursive-readdir");
const { today } = require("../keys/globals");
let recursivePromise = util.promisify(recursive);

// Imports the Google Cloud client library.
const { Storage } = require('@google-cloud/storage');

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.

const fileReader = async (location) => {
  let files = await recursivePromise(location);
  return files;  
};

const cloudUploader = (folderName, filePaths) => {
  
  const storage = new Storage();  
  const uploads = filePaths.map(async(filePath) => { // For each file...

    let filename = filePath.substring(filePath.lastIndexOf('/') +1 );
    let folder = filePath.split('/')[filePath.split('/').length -2];

    let stored = await storage.bucket("federal-register.appspot.com").upload(filePath, {
      destination: `${folderName}/${today}/${folder}/${filename}`,
      metadata: {
        cacheControl: 'no-cache',
      },
    });
    
    // Makes the file public
    let publicify = await storage
      .bucket("federal-register.appspot.com")
      .file(`/${folderName}/${today}/${folder}/${filename}`)
      .makePublic();

    return Promise.all([stored, publicify])
      .then(() => folderName);
    
  });
  
  return Promise.all(uploads);

};

const uploader = (settings) => {
  const promises = settings.map(async({ folderName, email }) => { // For each user...
    if(folderName){ // If folder exists...
      const folderLocation = path.resolve(__dirname, "..", "zipper", `${folderName}`);
      const filePaths = await fileReader(folderLocation); // Read file paths...
      return cloudUploader(folderName, filePaths); // Upload files...
    } else {
      return Promise.resolve(email);
    }
  });

  return Promise.all(promises);
}

module.exports = uploader;