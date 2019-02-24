const fs = require("fs-extra")
const mkdirp = require("mkdirp"); //  Makes nested files...
const { dirname: getDirName } = require("path");

const writeFile = (path, contents) => new Promise((resolve, reject) => {
    mkdirp(getDirName(path), err => { // make new folder at specified location...
        if (err) return reject(err);
        fs.writeFile(path, contents, err => {
            if (err) return reject(err);
            resolve(path);
        })
    });
});

module.exports = writeFile;