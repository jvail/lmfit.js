const fs = require('fs');
const pako = require('pako');

const wasm = Buffer.from(pako.deflate(fs.readFileSync(__dirname + '/../build/lmfit.web.wasm'), { level: 9 })).toString('base64');
const worker = Buffer.from(pako.deflate(fs.readFileSync(__dirname + '/../build/lm.webworker.js'), { level: 9 })).toString('base64');
fs.writeFileSync(__dirname + '/../build/lmfit.web.wasm.js', `export default "${wasm}";\n`);
fs.writeFileSync(__dirname + '/../build/lm.webworker.str.js', `export default "${worker}";\n`);
