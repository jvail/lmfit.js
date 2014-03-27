/*
  data = {
      f: function (){}  model function
      n: 0              no. of params
    , par:[]            initial param guess
    , m: 0              no. of data points
    , t: []             array x-axis points
    , y: []             array y-axis points
  }
*/

Module['fit'] = function (data) { // TODO: Accept strings

  var ret = {};

  /* wrap fitting function */
  var do_fit = cwrap('do_fit', 'number', ['number', 'number', 'number', 'number', 'number', 'number']);

  /* model function */
  var f = Runtime.addFunction(
    function (t, p) {
      /* get array values */
      var p_ = [];
      for (var i = 0; i < data.n; i++)
        p_[i] = getValue(p+i*8, 'double');
      /* model function evaluation */
      return data.f(t, p_);
    }
  );

  /* no. of params */
  var n = data.n;

  /* initial param guess */
  var par = data.par;

  /* no. of data points */
  var m = data.m;

  /* x-axis values */
  var t = data.t;

  /* y-axis values */
  var y = data.y;
  
  /* malloc enough space for the data */
  var par_ptr = _malloc(par.length * par.BYTES_PER_ELEMENT);
  var t_ptr = _malloc(t.length * t.BYTES_PER_ELEMENT);
  var y_ptr = _malloc(y.length * y.BYTES_PER_ELEMENT);

  // Copy data to Emscripten heap (directly accessed from Module.HEAPU8)
  var par_dataHeap = new Uint8Array(Module.HEAPU8.buffer, par_ptr, par.length * par.BYTES_PER_ELEMENT);
  var t_dataHeap = new Uint8Array(Module.HEAPU8.buffer, t_ptr, t.length * t.BYTES_PER_ELEMENT);
  var y_dataHeap = new Uint8Array(Module.HEAPU8.buffer, y_ptr, y.length * y.BYTES_PER_ELEMENT);
  
  par_dataHeap.set(new Uint8Array(par.buffer));
  t_dataHeap.set(new Uint8Array(t.buffer));
  y_dataHeap.set(new Uint8Array(y.buffer));

  ret.ret = do_fit(n, par_ptr, m, t_ptr, y_ptr, f);

  ret.params = [];
  for (var i = 0; i < par.length; i++)
    ret.params[i] = getValue(par_ptr+i*8, 'double');
  
  Runtime.removeFunction(f);
  /* free the heap buffer */
  _free(par_ptr);
  _free(t_ptr);
  _free(y_ptr);

  return ret;
};