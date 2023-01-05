# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

(Unreleased)
==================
### Changed
* ⚠️ Breaking: The Web browser version now runs in the main thread instead of a
  Web Worker. This change was made because it's not possible to securely
  transfer a Function from the main thread to a Worker; i.e., sites using a
  Content Security Policy would have had to enable `unsafe-eval`.

  An example has been added showing how to use this module from a Web Worker
  instead.
* ⚠️ Breaking: The Node.js version is now ESM-only; there is no CJS version.
* ⚠️ Breaking: The property `status` in the returned object was renamed to
  `converged`, and `status` is now a string describing why the function stopped.
* Don't inline-compress the Web browser version, and remove the pako dependency.
  This saves ~2900 bytes when the HTTP response itself is compressed, and
  reduces startup delay.
* In Node.js, don't install Emscripten's default process.uncaughtException,
  unhandledRejection listeners.
* Remove package-lock.json.
* Improve performance by reducing the number of calls between JS and WASM. For
  example, this provides a ~2.5x speedup for a dataset with 20,000 points.
* Add file extensions to import statements so modules are standard ES modules.
* Shrink the size of the generated code by setting various compiler options.
* Improve error messages when checking arguments.
* Update lmfit library (https://jugit.fz-juelich.de/mlz/lmfit/-/compare/497505787dcc9a2fa8420dd8f3f9b76c2dc8bab7...fce0bc2ebc9ba570046a7ed3fd2618fe7147e04a)
* The returned `params` array is now always populated, instead of only when the
  optimization has converged.
### Added
* The return value now includes the norm of the residuals and a string
  describing why the function stopped.
* Typescript definitions.
### Fixed
* Fix building with current emscripten (3.1.28).
* The `patience` parameter was ignored.

v3.0.0
==================
Not recorded here; see commit history.
