import lmfit from '/dist/lmfit.web.js';

self.onmessage = async function (evt) {
    // Asynchronously initialize the WebAssembly module:
    const { fit } = await lmfit();

    const { data, options } = evt.data;
    // If the model function was passed as a string, then turn it back into a
    // function here. If your site uses a Content-Security-Policy, this requires
    // `script-src: 'unsafe-eval'` (which is also required for WebAssembly to be
    // loaded, unless you only target the very new browsers that support
    // 'wasm-unsafe-eval'). *Only do this if you trust the model function.*
    data.model = new Function(`return ${data.model}`)();
    // Alternatively, specify the model as code directly:
    // data.model = (x, p) => p[0] * Math.sqrt(x);
    try {
        const r = fit(data, options || {});
        postMessage(r);
    } catch (err) {
        postMessage({ error: err.toString() });
    }
};
