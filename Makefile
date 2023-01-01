PWD = $(shell pwd)

LMFIT_SRC = $(PWD)/src/lmfit
BUILD_DIR = $(PWD)/src/build
DIST_DIR = $(PWD)/dist

EMX_FLAGS :=
EMX_FLAGS += -Os
EMX_FLAGS += -s EXPORT_ES6=1
EMX_FLAGS += -s MODULARIZE=1
EMX_FLAGS += -s USE_ES6_IMPORT_META=1
EMX_FLAGS += -s EXPORT_NAME='promise'
EMX_FLAGS += -s ALLOW_MEMORY_GROWTH=1
EMX_FLAGS += -s ALLOW_TABLE_GROWTH=1
EMX_FLAGS += -s INITIAL_MEMORY=8MB
EMX_FLAGS += -s RESERVED_FUNCTION_POINTERS=16
EMX_FLAGS += -s NODEJS_CATCH_EXIT=0
EMX_FLAGS += -s NODEJS_CATCH_REJECTION=0
EMX_FLAGS += --memory-init-file 0
EMX_FLAGS += --minify 0
EMX_FLAGS += -s TEXTDECODER=2
EMX_FLAGS += -s MALLOC=emmalloc
EMX_FLAGS += -s MIN_SAFARI_VERSION=130100
EMX_FLAGS += -s STRICT_JS=1
EMX_FLAGS += --no-entry

all: lmfit.js

dir:
	mkdir -p $(LMFIT_SRC)/build;
	mkdir -p $(PWD)/src/build;

node: lmfit
	emcc $(EMX_FLAGS) -I$(LMFIT_SRC)/lib $(LMFIT_SRC)/build/lib/liblmfit.a src/lmfit.js.c \
	-s ENVIRONMENT="node" \
	-s EXPORTED_RUNTIME_METHODS="[addFunction, removeFunction, getValue, cwrap]" \
	-s EXPORTED_FUNCTIONS="[_do_fit, _malloc, _free]" \
	--post-js $(PWD)/src/lm.js \
	-o $(DIST_DIR)/lmfit.mjs;

web: lmfit
	emcc $(EMX_FLAGS) -I$(LMFIT_SRC)/lib $(LMFIT_SRC)/build/lib/liblmfit.a src/lmfit.js.c \
	-s ENVIRONMENT="web" \
	-s EXPORTED_RUNTIME_METHODS="[addFunction, removeFunction, getValue, cwrap]" \
	-s EXPORTED_FUNCTIONS="[_do_fit, _malloc, _free]" \
	-s SINGLE_FILE=1 \
	--post-js $(PWD)/src/lm.js \
	-o $(DIST_DIR)/lmfit.web.js;

lmfit: dir lmfit-patch
	cd $(LMFIT_SRC)/build; \
	emcmake cmake -DCMAKE_CROSSCOMPILING_EMULATOR='node' ..; \
	emmake make -j4;

lmfit-patch:
	sed -i -e 's|$${CMAKE_CROSSCOMPILING_EMULATOR} COMMAND|COMMAND $${CMAKE_CROSSCOMPILING_EMULATOR}|g' $(LMFIT_SRC)/test/CMakeLists.txt;

lmfit-test: lmfit
	cp -fr $(LMFIT_SRC)/build/bin/* $(LMFIT_SRC)/build/test;
	cd $(LMFIT_SRC)/build && ctest;

clean:
	rm -fr $(LMFIT_SRC)/build;
	rm -fr $(BUILD_DIR);
