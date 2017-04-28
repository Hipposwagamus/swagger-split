const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const yaml = require('js-yaml');
const _ = require('lodash');
const path = require('path');
const camelCase = require('camelcase');
const bundle = require('./bundler.js');

function run() {
  if(args._.length === 3){
    const yamlFile = args._[0];
    const depth = args._[1];
    const outputDir = args._[2];
    try {
      var doc = yaml.safeLoad(fs.readFileSync(yamlFile, 'utf8'));
      fs.mkdirSync(outputDir);
      split(doc, depth, outputDir);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.error("not enough args. Must be node index.js <file-to-read> <depth> <output-dir>");
  }
}

function directify(name){
  return camelCase(name.replace(/[^\w\s]/gi, '_'));
}

function split(obj, depth, dir){
  if (depth === 0){
    let indexObj = {};
    _.forIn(obj, (v, k) => {
      if(_.isObject(v) && !_.isArray(v)){
        let kFile = directify(k) + ".yaml";
        let file = path.join(dir, kFile);
        indexObj[k] = {"$ref": './' + kFile}
        fs.writeFileSync(file, yaml.dump(v));
      } else {
        indexObj[k] = v;
      }

      fs.writeFileSync(path.join(dir, "index.yaml"), yaml.dump(indexObj));
    });
  } else {
    let indexObj = {};
    _.forIn(obj, (v, k) => {
      if(_.isObject(v) && !_.isArray(v)){
        let newDir = path.join(dir, directify(k));
        indexObj[k] = {"$ref": './' + path.join(directify(k), "index.yaml")}
        fs.mkdirSync(newDir);
        split(v, depth - 1, newDir);
      } else {
        indexObj[k] = v;
      }
    });

    fs.writeFileSync(path.join(dir, "index.yaml"), yaml.dump(indexObj));

  }
}


function splitFile(file, depth, outputDirectory){
  var doc = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
  fs.mkdirSync(outputDirectory);
  split(doc, depth, outputDirectory);
}

if (!module.parent) {
  run();
} else {
  module.exports = {
    splitFile
  };
}