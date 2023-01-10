import lm from '/dist/lmfit.web.js';
// Asynchronously initialize the WebAssembly module:
const {fit} = await lm();

function random(mean, stddev) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stddev + mean;
}

function makeData(model, params) {
    const x = [], y = [];
    for (let i = 0; i < 1000; i++) {
        x.push(i);
        y.push(model(i, params) + model(i, params) * random(0, 0.2));
    }
    return { x, y };
}

const options = {
    ftol: Number.EPSILON,
    xtol: Number.EPSILON,
    gtol: Number.EPSILON,
    epsilon: Number.EPSILON,
    patience: 1000,
    verbose: false
};

const test_params = [5.5];
const model = (x, p) => p[0] * Math.sqrt(x);
const { x, y } = makeData(model, test_params);

const data = {
    guess: [99],
    model,
    x, y
};

console.time("fit");
const r = fit(data, options);
console.timeEnd("fit");
console.log(r);
