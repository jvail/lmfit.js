# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

(Unreleased)
==================
### Changed
* In Node.js, don't install Emscripten's default process.uncaughtException,
  unhandledRejection listeners.
* Remove package-lock.json.
* Improve performance by reducing the number of calls between JS and WASM. For
  example, this provides a ~2.5x speedup for a dataset with 20,000 points.
* Add file extensions to import statements so modules are standard ES modules.
### Added
### Fixed
* Fix building with current emscripten (3.1.28).
* The `patience` parameter was ignored.

v3.0.0
==================
Not recorded here; see commit history.
