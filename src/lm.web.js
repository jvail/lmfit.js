import * as pako from 'pako';
import worker from './build/lm.webworker.str.js';
import wasm from './build/lmfit.web.wasm.js';
const workerURL = URL.createObjectURL(new Blob([pako.inflate(atob(worker), { to: 'string' })], { type: 'text/javascript' }));
const wasmBinary = pako.inflate(Uint8Array.from(atob(wasm), c => c.charCodeAt(0))).buffer;
export default () => {
    const worker = new Worker(workerURL);
    worker.postMessage({ wasmBinary });
    return worker;
};
