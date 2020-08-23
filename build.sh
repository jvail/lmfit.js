#build lmfit.js
EMCC_DEBUG=1 emcc --memory-init-file 0 -Os src/lmfit/build/lib/liblmfit.a -o lmfit.js --pre-js src/pre.js --post-js src/post.js -s EXPORTED_FUNCTIONS="['_do_fit']" -s RESERVED_FUNCTION_POINTERS=20
