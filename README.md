# lmfit.js

JavaScript/WebAssembly (emscripten) port of lmfit (lmcurve) library:

"a self-contained C library for Levenberg-Marquardt least-squares minimization and curve fitting" (https://jugit.fz-juelich.de/mlz/lmfit)

## build & test

```
source {path to emsdk}/emsdk_env.sh
npm install
npm run dist
npm run test
```

## usage

There is a browser (lm.js - WebWorker) and a node (lm.node.js + wasm file) version in the dist folder.
The browser version does not require a wasm file since it is all bundled.

Read about the available options at src/lm.js and https://jugit.fz-juelich.de/mlz/lmfit/-/blob/master/lib/lmstruct.h

### web

```js
import lm from 'lmfit.js';

const options = {
    verbose: true
};

const data = {
    guess: [99],
    model: 'p[0] * Math.sqrt(x)',
    x, y
};

const worker = lm();
worker.onmessage = (ev) => {
    console.log(ev.data)
    if (ev.data.initialized) {
        worker.postMessage({ data, options })
    }
};
```

### node

```js
const lmPromised = require('lmfit.js');

lmPromised.then(lm => {

    const options = {
        verbose: true
    };

    const data = {
        guess: [1, 1, -1],
        model: function (x, p) {
            return p[0] * Math.pow(x, p[1]) * Math.exp(p[2] * x);
        },
        x, y
    };

    const ret = lm.fit(data, options);

});
```

## missing features

- surface fitting as example for minimization with lmmin()
- nonlinear equations solving with lmmin()
