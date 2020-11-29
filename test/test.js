const lmPromised = require('../dist/lm.node');

// https://mika-s.github.io/javascript/random/normal-distributed/2019/05/15/generating-normally-distributed-random-numbers-in-javascript.html

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
    return {x, y};

}

const options = {
    ftol: Number.EPSILON,
    xtol: Number.EPSILON,
    gtol: Number.EPSILON,
    epsilon: Number.EPSILON,
    patience: 1000,
    verbose: false
};

lmPromised.then(lm => {

    {   /* logistic function */

        const test_params = [1.5, 2, -0.5];
        const model = function (x, p) {
            return p[0] * Math.pow(x, p[1]) * Math.exp(p[2] * x);
        };
        const { x, y } = makeData(model, test_params);

        const data = {
            guess: [1, 1, -1],
            model,
            x, y
        };

        const ret = lm.fit(data);
        console.log(ret, test_params.map((t, i) => Math.abs(t - ret.params[i])));

    }

    {   /* wood curve (lactation) */


        const test_params = [20, 0.3, -0.05];
        const model = function (x, p) {
            return p[0] * Math.pow(x, p[1]) * Math.exp(p[2] * x);
        };
        const { x, y } = makeData(model, test_params);

        const data = {
            guess: [1, 1, -1],
            model,
            x, y
        };

        const ret = lm.fit(data, options);
        console.log(ret, test_params.map((t, i) => Math.abs(t - ret.params[i])));

    }

    {   /* sqrt */

        const test_params = [5.5];
        const model = function(x, p) {
            return p[0] * Math.sqrt(x);
        };
        const { x, y } = makeData(model, test_params);

        const data = {
            guess: [99],
            model,
            x, y
        };

        const ret = lm.fit(data, options);
        console.log(ret, test_params.map((t, i) => Math.abs(t - ret.params[i])));

    }

});
