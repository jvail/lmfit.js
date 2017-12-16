#build lmfit.js
EMCC_DEBUG=1 emcc --memory-init-file 0 -O3 -Isrc/lmfit-6.4 src/lmfit.js.c src/lmfit-6.4/lmcurve.c src/lmfit-6.4/lmmin.c -o lmfit.js --pre-js src/pre.js --post-js src/post.js -s EXPORTED_FUNCTIONS="['_do_fit']" -s RESERVED_FUNCTION_POINTERS=20
