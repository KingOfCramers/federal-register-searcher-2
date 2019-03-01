const path = require("path");
const { today } = require("../keys/globals");

// Imports the Google Cloud client library.
const { Storage } = require('@google-cloud/storage');

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.

const cloudUploader = async (location, fileName, email) => {

  const storage = new Storage();
  let stored = await storage.bucket("federal-register.appspot.com").upload(location, {
    destination: `${fileName}/${today}.zip`,
    metadata: {
      cacheControl: 'no-cache',
    },
  });
  
  // Makes the file public
  let publicify = await storage
    .bucket("federal-register.appspot.com")
    .file(`/${fileName}/${today}.zip`)
    .makePublic();

  Promise.all([stored, publicify, Promise.resolve(email)])
    .then(() => { email,})
};

const uploader = async (settings) => {
  console.log("Uploading files...\n")

  const promises = settings.map(({ folderName, email }) => {
    if(folderName){
      const location = path.resolve(__dirname, "..", `${folderName}.zip`);
      return cloudUploader(location, folderName, email);
    } else {
      return Promise.resolve(email);
    }
  });
  return Promise.all(promises);
}

module.exports = uploader;