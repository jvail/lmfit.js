# lmfit.js

JavaScript (emscripten) port of lmfit library:

"a self-contained C library for Levenberg-Marquardt least-squares minimization and curve fitting" (https://jugit.fz-juelich.de/mlz/lmfit)

Currently only curve fitting is implemented. Some examples: http://jvail.github.io/dairy.js/,  https://m0ose.github.io/lmfit.js/test2.html


## build
    mkdir build && cd build
    emcmake cmake .. -DCMAKE_CROSSCOMPILING_EMULATOR=node
    emmake make
    ctest

## missing features

- surface fitting as example for minimization with lmmin()
- nonlinear equations solving with lmmin()
