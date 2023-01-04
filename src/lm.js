function initLmFit(Module) {

    const statuses = [
        "found zero (sum of squares below underflow limit)",
        "converged (the relative error in the sum of squares is at most tol)",
        "converged (the relative error of the parameter vector is at most tol)",
        "converged (both errors are at most tol)",
        "trapped (by degeneracy; increasing epsilon might help)",
        "exhausted (number of function calls exceeding preset patience)",
        "failed (ftol<tol: cannot reduce sum of squares any further)",
        "failed (xtol<tol: cannot improve approximate solution any further)",
        "failed (gtol<tol: cannot improve approximate solution any further)",
        "crashed (not enough memory)",
        "exploded (fatal coding error: improper input parameters)",
        "stopped (break requested within function evaluation)",
        "found nan (function value is not-a-number or infinite)",
        "won't fit (no free parameter)"
    ];

    const {
        HEAPF64,
        getValue,
        addFunction,
        removeFunction,
        _free,
        _malloc,
        cwrap
    } = Module;

    const do_fit = cwrap('do_fit', 'void', [
        'number', 'number', 'number', 'number', 'number', 'number',
        'number', 'number', 'number', 'number', 'number', 'number',
        'number'
    ]);

    function addModel(model, n, x, nanVal) {

        const fn = function (parPtr, m, nullPtr, fvecPtr, infoPtr) {
            const {isNaN} = Number;
            const p = new Float64Array(HEAPF64.buffer, parPtr, n);
            const fvec = new Float64Array(HEAPF64.buffer, fvecPtr, m);
            for (let i = 0; i < m; ++i) {
                let y = model(x[i], p);
                if (isNaN(y)) y = nanVal;
                fvec[i] = y;
            }
        };

        return addFunction(fn, 'viiiii');

    }

    const fit = function (data, options={}) {

        const {
            model,      /* model function */
            guess,      /* initial param guess */
            x,          /* x-axis values */
            y           /* y-axis values */
        } = data;

        if (typeof model !== 'function' || model.length !== 2)
            throw new Error('model must be a function accepting 2 parameters.');
        if (!Array.isArray(guess))
            throw new Error('guess must be an array.');
        if (!Array.isArray(x))
            throw new Error('x must be an array.');
        if (!Array.isArray(y))
            throw new Error('y must be an array.');
        if (x.length !== y.length)
            throw new Error('x and y must have the same length.');

        const {
            verbose,    /* print to console while fitting */
            nan,        /* value returned if model evaluates to NaN */
            ftol,       /* see lmstruct.h */
            xtol,
            gtol,
            epsilon,
            stepbound,
            patience
        } = options;

        const fn_ptr = addModel(model, guess.length, x, nan || 9999);

        const guess_ptr = _malloc(guess.length * 8);
        const guess_data = new Float64Array(HEAPF64.buffer, guess_ptr, guess.length);
        guess_data.set(guess);

        const y_ptr = _malloc(y.length * 8);
        const y_data = new Float64Array(HEAPF64.buffer, y_ptr, y.length);
        y_data.set(y);

        const status_ptr = _malloc(8 + 4); // sizeof(output)

        do_fit(
            guess.length, guess_ptr, x.length, y_ptr, fn_ptr,
            +!!verbose,
            ftol || 30 * Number.EPSILON,
            xtol || 30 * Number.EPSILON,
            gtol || 30 * Number.EPSILON,
            epsilon || 30 * Number.EPSILON,
            stepbound || 100,
            patience || 100,
            status_ptr
        );

        const fnorm = getValue(status_ptr, 'double')
        const outcome = getValue(status_ptr + 8, 'i32');
        const converged = outcome <= 3;

        const params = [];
        if (converged) {
            for (let i = 0; i < guess.length; i++) {
                params[i] = getValue(guess_ptr + i * 8, 'double');
            }
        }

        removeFunction(fn_ptr);
        _free(guess_ptr);
        _free(y_ptr);
        _free(status_ptr);

        if (verbose) {
            console.log("fitting data as follows:");
            for (let i = 0; i < x.length; ++i)
                console.log(
                    "  t[%s]=%s y=%s fit=%s residue=%s",
                    i.toString().padStart(2),
                    x[i].toString().padStart(4),
                    y[i].toString().padStart(6),
                    model(x[i], params).toString().padStart(10),
                    y[i] - model(x[i], params).toString().padStart(12)
                );

            console.log(converged ? "SUCCESS" : "FAILURE");
        }

        return {
            converged,
            params,
            fnorm,
            status: statuses[outcome]
        };

    };

    Module.fit = fit;

}

initLmFit(Module);
