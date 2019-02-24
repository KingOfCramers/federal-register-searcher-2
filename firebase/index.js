const admin = require("firebase-admin");
const serviceAccount = require("../keys/admin.key.json");
const storageBucket = require("../keys/bucket").bucket;
const { searchDocs, fetchDocs } = require("../prepDocs");
const path = require("path");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://federal-register.firebaseio.com",
  storageBucket
});

const auth = admin.auth();
const db = admin.database();
const bucket = admin.storage().bucket();
var ref = db.ref("/");


fbDaemon = async ({ ruleFolderNames, otherFolderNames }) => {

  // Set up users...
  const snapshot = await ref.once("value");
  const users = [];
  snapshot.forEach(user => { users.push(user) });

  // Create Promise for each user, use promise.all to resolve when each user is complete...
  return Promise.all(users.map((user) => {    
    return auth.getUser(user.key)
      .then(async(userRecord) => {
        let email = userRecord.toJSON().email;
        console.log(`getting firebase data for ${email}...\n`);
        return getUserSettings(email, user, ruleFolderNames, otherFolderNames);
      });
  }));
};

const getUserSettings = async (email, user, ruleFolderNames, otherFolderNames) => {

  let promises = Promise.all(Object.values(user.val()).map(async(res) => { // For each department...

    let rules = res.rules;
    let dep = res.department.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
    let keywords = res.search;

    if(!keywords){
      if(ruleFolderNames.includes(dep)){
        return fetchDocs("rules", dep);
      } else if (!rules && (otherFolderNames.includes(dep))){
        return fetchDocs("other", dep);
      } else {
        return Promise.resolve({ type: null, dep }) // This is not necessary, but makes things clearer...
      }
    } else {
      keywords = Object.values(keywords);
      if(ruleFolderNames.includes(dep)){
        return searchDocs("rules", dep, keywords); // These each resolve to be a promise...
      } else if (!rules && (otherFolderNames.includes(dep))){
        return searchDocs("other", dep, keywords);
      } else {
        return Promise.resolve({ type: null, dep, matches: [], search: keywords })
      }
    };
  }));

  return promises.then(res => {

    let final = { email, searchDeps: [], fullDeps: [] };

    res.forEach((item) => {
      if(!item.search && item.type){ // If no search, and type exists (full department...)
        final.fullDeps.push({ dep: item.dep, type: item.type, all: item.all });
        return;
      } else if (item.search && item.matches.length > 0){ // If search is enabled, and matches has found docs...
        final.searchDeps.push({ dep: item.dep, type: item.type, matches: item.matches });
      };
    });

    return final;

  });
};

const uploader = (res) => {
  filePath = path.resolve(__dirname, "..", "2017-10-3", "other", "Energy Department", "2017-21332_PI.pdf")
  // Uploads a local file to the bucket
  bucket.upload(filePath);
};

module.exports = {
  fbDaemon,
  uploader
};