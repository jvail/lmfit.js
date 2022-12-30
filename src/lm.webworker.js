import lmfit from './build/lmfit.web.js';
import LM from './lm.js';
let lm = null;

self.onmessage = function (evt) {
    if (lm) {
        const { data, options } = evt.data;
        try {
            data.model = new Function(['x', 'p'], 'return ' + data.model);
            postMessage(lm.fit(data, options || {}));
        } catch (err) {
            postMessage({ error: err.toString() });
        }
    } else {
        const { wasmBinary } = evt.data;
        if (wasmBinary) {
            try {
                lmfit({ wasmBinary })
                    .then(lmfit => {
                        lm = LM(lmfit);
                        self.postMessage({ initialized: true });
                    });
            } catch (err) {
                postMessage({ error: err.toString() });
            }
        }
    }
}
