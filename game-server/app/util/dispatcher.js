const crc = require('crc');

module.exports.dispatch = function(subseed, eleList) {
  const seed = Math.abs(crc.crc32(subseed));
  const index = (seed % eleList.length);
  return eleList[index];
};

module.exports.dispatchAndPop = function(seed, eleList) {
  const index = (seed % eleList.length);
  if (typeof eleList[index] == "number") {
    const toRet = eleList[index]; 
    eleList.splice(index, 1);
    return toRet; 
  }
  if (typeof eleList[index] == "string") {
    const toRet = eleList[index].slice(0); 
    eleList.splice(index, 1);
    return toRet; 
  }
  if (typeof eleList[index] == "object") {
    const toRet = {};
    Object.assign(toRet, eleList[index]); 
    eleList.splice(index, 1);
    return toRet; 
  } 
  return null;
};
