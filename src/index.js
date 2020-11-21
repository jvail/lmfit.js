import lmfit from './build/lmfit';

const lm = lmfit().then(lmfit => {

    const {
        getValue,
        setValue,
        stackAlloc,
        HEAP8,
        stringToUTF8,
        lengthBytesUTF8,
        writeArrayToMemory,
        _free,
        _malloc,
        Runtime
    } = lmfit;

    const do_fit = lmfit.cwrap('do_fit', 'number', ['number', 'number', 'number', 'number', 'number', 'number']);

    function addModel(model) {

        return Runtime.addFunction(
            function (t, p) {
                /* get array values */
                const p_ = [];
                for (let i = 0; i < data.n; i++)
                    p_[i] = getValue(p + i * 8, 'double');
                /* model function evaluation */
                return model(t, p_);
            }
        );

    }

    const fit = function (data) {

        const {
            verbose,    /* print to console while fitting */
            model,      /* model function */
            guess,      /* initial param guess */
            n,          /* no. of params */
            m,          /* no. of data points */
            x,          /* x-axis values */
            y           /* y-axis values */
        } = data;

        const fn = addModel(model);

        /* malloc enough space for the data */
        const par_ptr = _malloc(par.length * par.BYTES_PER_ELEMENT);
        const t_ptr = _malloc(x.length * x.BYTES_PER_ELEMENT);
        const y_ptr = _malloc(y.length * y.BYTES_PER_ELEMENT);

        // Copy data to Emscripten heap (directly accessed from Module.HEAPU8)
        const par_dataHeap = new Uint8Array(Module.HEAPU8.buffer, par_ptr, par.length * par.BYTES_PER_ELEMENT);
        const t_dataHeap = new Uint8Array(Module.HEAPU8.buffer, t_ptr, x.length * x.BYTES_PER_ELEMENT);
        const y_dataHeap = new Uint8Array(Module.HEAPU8.buffer, y_ptr, y.length * y.BYTES_PER_ELEMENT);

        par_dataHeap.set(new Uint8Array(par.buffer));
        t_dataHeap.set(new Uint8Array(x.buffer));
        y_dataHeap.set(new Uint8Array(y.buffer));

        const status = !!do_fit(n, par_ptr, m, t_ptr, y_ptr, f, +verbose);
        const params = [];

        if (status) {
            for (let i = 0; i < par.length; i++)
                params[i] = getValue(par_ptr + i * 8, 'double');
        }

        Runtime.removeFunction(fn);
        _free(par_ptr);
        _free(t_ptr);
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
