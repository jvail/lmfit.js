import lmfit from '/dist/lmfit.web.js';

self.onmessage = async function (evt) {
    // Asynchronously initialize the WebAssembly module:
    const {fit} = await lmfit();

    const { data, options } = evt.data;
    try {
        data.model = (x, p) => p[0] * Math.sqrt(x);
        const r = fit(data, options || {});
        postMessage(r);
    } catch (err) {
        postMessage({ error: err.toString() });
    }
};
