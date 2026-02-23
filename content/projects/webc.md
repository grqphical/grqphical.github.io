---
title: "webc"
---
webc is a compiler for C99 that outputs WASM and a JS runtime for both servers and browsers. The goal of webc is to create a runtime similar to \
native C that can be run either in the browser or on the server (with Node.js, Bun etc.)

My goal is to write a fully working C99 compiler with a preprocessor, lexer, parser, code generator, and linker from scratch. I also want to create a custom runtime for
programs compiled with webc that includes file system support (both in the browser and on the server), signal support (so that event from JS can call C code), and much more.

It's currently in very early stages of development, as of `2026-02-06` it can can compile C code that has a main function, int/float/char variables, modifications to those variables
and returning values from the main function.

[Project Repo](https://github.com/grqphical/webc)
