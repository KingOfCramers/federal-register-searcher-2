const path = require("path");

// Imports the Google Cloud client library.
const { Storage } = require('@google-cloud/storage');

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.

const cloudUploader = async (path, fileName, email) => {

  const storage = new Storage();

  let stored = await storage.bucket("federal-register.appspot.com").upload(path, {
    gzip: true,
    metadata: {
      cacheControl: 'no-cache',
    },
  });
  
  // Makes the file public
  let publicify = await storage
    .bucket("federal-register.appspot.com")
    .file(`${fileName}.zip`)
    .makePublic();

  return Promise.all([stored, publicify, Promise.resolve(email)]);
  
};

const uploader = async (settings) => {
  console.log("Uploading files...\n")

  const promises = settings.map(({ fileName, email }) => {
    if(fileName !== "X"){
      const location = path.resolve(__dirname, "..", `${fileName}.zip`);
      return cloudUploader(location, fileName, email);
    } else {
      return Promise.resolve(email);
    }
  });
  return Promise.all(promises);
}

module.exports = uploader;