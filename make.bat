emcc -o e131.js e131.c e131Exports.c^
 -O2^
 -s WASM=1^
 -s MODULARIZE=1^
 -s NO_EXIT_RUNTIME=1^
 -s EXTRA_EXPORTED_RUNTIME_METHODS="['ccall','cwrap', 'getValue','setValue']"^
 -s EXPORTED_FUNCTIONS="['_makePackages', '_free', '_calloc']

 
 



