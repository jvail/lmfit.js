import lmfit from './build/lmfit';

const lm = lmfit().then(lmfit => {

    const {
        HEAPU8,
        getValue,
        addFunction,
        _free,
        _malloc
    } = lmfit;

    const do_fit = lmfit.cwrap('do_fit', 'number', ['number', 'number', 'number', 'number', 'number', 'number']);

    function addModel(model, n) {

        const fn = function (t, ptr) {
            const p = [];
            for (let i = 0; i < n; i++)
                p[i] = getValue(ptr + i * 8, 'double');
            return model(t, p);
        };

        return addFunction(fn, 'ddi');

    }

    const fit = function (data) {

        const {
            verbose,    /* print to console while fitting */
            model,      /* model function */
            guess,      /* initial param guess */
            x,          /* x-axis values */
            y           /* y-axis values */
        } = data;

        const fn_ptr = addModel(model, guess.length);

        const guess_ptr = _malloc(guess.length * 8);
        const x_ptr = _malloc(x.length * 8);
        const y_ptr = _malloc(y.length * 8);

        const guess_data = new Uint8Array(HEAPU8.buffer, guess_ptr, guess.length * 8);
        const x_data = new Uint8Array(HEAPU8.buffer, x_ptr, x.length * 8);
        const y_data = new Uint8Array(HEAPU8.buffer, y_ptr, y.length * 8);

        guess_data.set(new Uint8Array((new Float64Array(guess)).buffer));
        x_data.set(new Uint8Array((new Float64Array(x)).buffer));
        y_data.set(new Uint8Array((new Float64Array(y)).buffer));

        const status = !!do_fit(guess.length, guess_ptr, x.length, x_ptr, y_ptr, fn_ptr, +!!verbose);
        const params = [];

        if (status) {
            for (let i = 0; i < guess.length; i++) {
                params[i] = getValue(guess_ptr + i * 8, 'double');
            }
        }

        lmfit.removeFunction(fn_ptr);
        _free(guess_ptr);
        _free(x_ptr);
        _free(y_ptr);

        return {
            status,
            params
        };

    };

    return {
        fit
    }


});

export default lm;
