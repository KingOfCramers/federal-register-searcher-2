const path = require("path");
const util = require("util");
const recursive = require("recursive-readdir");

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

const uploader = async (settings) => {
  console.log("Uploading files...\n")

  const promises = settings.map(({ folderName, email }) => {
    if(folderName !== "X"){
      const location = path.resolve(__dirname, "..", "zipper", `${folderName}`);
      return fileReader(location, folderName, email)
        .then((filePaths) => {
          const storage = new Storage();
          let bucketTarget = `federal-register.appspot.com/${folderName}`
          return filePaths.map(async(fileLocation, i) => {

              // Upload file...
              let stored = await storage.bucket(`${bucketTarget}/${i}`).upload(fileLocation, {
                gzip: false,
                metadata: {
                  cacheControl: 'no-cache',
                },
              });
          
              // Makes the file public
              let publicify = await storage.bucket(`${bucketTarget}/`)
                .file(`${i}`)
                .makePublic();
          
              return Promise.all([stored, publicify, Promise.resolve(email)]);
          
          });
        });
    } else {
      return Promise.resolve(email);
    }
  });

  return Promise.all(promises);
}

module.exports = uploader;