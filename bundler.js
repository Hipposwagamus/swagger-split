const YAML = require('js-yaml');
const fs = require('fs');
var path = require('path');
var _ = require('lodash');

const defaultMaxDepth = 10;

function loadFile(file){
  let type = path.extname(file);
  if(type === '.json'){
    return JSON.parse(fs.readFileSync(file).tostring());
  } else if (type === '.yaml'){
    return YAML.load(fs.readFileSync(file).toString());
  }
}

function constructSwagger(obj, dir, depthLeft){
  if(depthLeft < 0){
    throw new Error(`Maximum reference depth exceeded (Default is ${defaultMaxDepth})`);
  }
  if(!_.isNil(obj.$ref) && !_.startsWith(obj.$ref, '#')){
    let nextFile = path.resolve(dir, obj.$ref);
    return constructSwagger(loadFile(nextFile), path.dirname(nextFile), depthLeft - 1);
  } else {
    return _.mapValues(obj, (v) => {
      if(_.isObject(v) && !_.isArray(v)){
        return constructSwagger(v, dir, depthLeft - 1);
      } else {
        return v;
      }
    });
  }
}

function bundle(indexFile, options){
  const maxDepth = (_.isNil(options.maxDepth) ? defaultMaxDepth : options.maxDepth ); 
  const initialDir = path.dirname(indexFile);

  const obj = constructSwagger(loadFile(indexFile), initialDir, maxDepth);

  if(!_.isNil(options.outFile)){
    let type = path.extname(options.outFile);
    if(type === ".json") {
      fs.writeFileSync(options.outFile, JSON.stringify(obj));
    } else if (type === ".yaml") {
      fs.writeFileSync(options.outFile, YAML.dump(obj));
    } else {
      throw new Error(`The provided output format of ${type} is not supported`);
    }
  } else {
    return obj;
  }
}

module.exports = {
  bundle
};