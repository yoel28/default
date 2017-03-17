#!/bin/bash
find ./appRoot -type f -name '*.js' -exec rm -f {} \;
find ./appRoot -type f -name '*.js.map' -exec rm -f {} \;
find ./appRoot -type f -name '*.d.ts' -exec rm -f {} \;
find ./appRoot -type f -name '*.gz*' -exec rm -f {} \;
rm -f ./system-config.js;
rm -f ./system-config.js.map;
rm -f ./build.js.map;
rm -f ./build.js.map;
rm -rf dist/
rm -rf aot/