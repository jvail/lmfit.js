#build lmfit-js
emcc -O2 -Ilmfit-5.1 lmfit.js.c lmfit-5.1/lmcurve.c lmfit-5.1/lmmin.c -o lmfit.js --pre-js pre.js --post-js post.js -s EXPORTED_FUNCTIONS="['_do_fit']" -s RESERVED_FUNCTION_POINTERS=20

