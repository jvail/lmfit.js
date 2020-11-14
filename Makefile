PWD = $(shell pwd)

LMFIT_SRC = $(PWD)/src/lmfit

EMX_FLAGS :=
EMX_FLAGS += -Os
EMX_FLAGS += -s EXPORT_ES6=1
EMX_FLAGS += -s MODULARIZE=1
EMX_FLAGS += -s USE_ES6_IMPORT_META=0
EMX_FLAGS += -s EXPORT_NAME='lmfit'
EMX_FLAGS += -s WASM_ASYNC_COMPILATION=0
EMX_FLAGS += -s ALLOW_MEMORY_GROWTH=1
EMX_FLAGS += -s RESERVED_FUNCTION_POINTERS=4
EMX_FLAGS += -s RETAIN_COMPILER_SETTINGS=1
EMX_FLAGS += -s DISABLE_EXCEPTION_CATCHING=0
EMX_FLAGS += -s ENVIRONMENT='web'
EMX_FLAGS += --memory-init-file 0
EMX_FLAGS += --minify 0


all: lmfit.js

dir:
	mkdir -p $(LMFIT_SRC)/build;

lmfit.js: lmfit
	emcc $(EMX_FLAGS) -I$(LMFIT_SRC)/lib $(LMFIT_SRC)/build/lib/liblmfit.a src/lmfit.js.c \
	-s EXPORTED_FUNCTIONS="[_do_fit]" -o lmfit.js;

lmfit: dir lmfit-patch
	cd $(LMFIT_SRC)/build; \
	emcmake cmake -DCMAKE_CROSSCOMPILING_EMULATOR='node' ..; \
	emmake make -j4;

lmfit-patch:
	sed -i \
	-e 's|add_test($${app} $${CMAKE_CURRENT_BINARY_DIR}/$${app})|add_test($${app} $${CMAKE_CROSSCOMPILING_EMULATOR} $${CMAKE_CURRENT_BINARY_DIR}/$${app})|g' \
	-e 's|add_test(curve1   $${CMAKE_CURRENT_BINARY_DIR}/../demo/curve1)|add_test(curve1 $${CMAKE_CROSSCOMPILING_EMULATOR} $${CMAKE_CURRENT_BINARY_DIR}/../demo/curve1)|g' \
	-e 's|add_test(surface1 $${CMAKE_CURRENT_BINARY_DIR}/../demo/surface1)|add_test(surface1 $${CMAKE_CROSSCOMPILING_EMULATOR} $${CMAKE_CURRENT_BINARY_DIR}/../demo/surface1)|g' \
	$(LMFIT_SRC)/test/CMakeLists.txt;

lmfit-test: lmfit
	cd $(LMFIT_SRC)/build && ctest;
