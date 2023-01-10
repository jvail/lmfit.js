# lmfit.js

JavaScript/WebAssembly (emscripten) port of lmfit (lmcurve) library:

> a self-contained C library for Levenberg-Marquardt least-squares minimization and curve fitting  
> https://jugit.fz-juelich.de/mlz/lmfit

Which is, itself, a port of the Netlib Minpack FORTRAN library.

## Usage

lmfit.js is usable from Node.js and Web browsers.

```js
import initLmFit from 'lmfit.js';
// WebAssembly initialization is asynchronous:
const lm = await initLmFit();

const data = {
    guess: [1, 1, -1], // the initial parameter guesses
    model(x, p) { // the objective function to optimize
        return p[0] * Math.pow(x, p[1]) * Math.exp(p[2] * x);
    },
    x, // the X values
    y // the Y values
};

const options = {
    verbose: true
};

const ret = lm.fit(data, options);
// {
//    converged: true,
//    params: [ /* the optimized parameters */ ],
//    fnorm: 1.234,
//    status: 'converged (the relative error of the parameter vector is at most tol)'
// }
```

See index.d.ts for info on the supported `options`.

## Examples

Run `node ./examples/server.js`, then open your browser to one of the following
and open the browser console:

1. http://localhost:50000/examples/main-thread.html - This shows running lmfit
   in the main JS thread.

2. http://localhost:50000/examples/webworker.html - This shows running lmfit in
   a web Worker. It does not work in Firefox because [Firefox doesn't support
   modules in Workers](https://bugzilla.mozilla.org/show_bug.cgi?id=1247687).
      > Note: Worker communication has significant overhead. For this example,
        the main thread version runs in ~1 ms, while the Worker version runs in
        ~50 ms.

## Missing features

- surface fitting as example for minimization with lmmin()
- nonlinear equations solving with lmmin()

## Build & test (for developers of lmfit.js)

lmfit.js is known to build with emsdk 3.1.28.

```
source {path to emsdk}/emsdk_env.sh
npm install
npm run dist
npm run test
```
