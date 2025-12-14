---
tags:
    - Dungeon Designer
title: How I package static assets for my C/Raylib game
date: 2025-12-14T12:38:00+07:00
author: "Nathan Jacobson"
ShowBreadCrumbs: true
---
So I am currently building a game called **Dungeon Designer**, the premise of which is you are a company hired by people to design dungeons to prevent heros from stealing the loot
that they contain. It's basically a reverse dungeon crawler. I'm building it in C using raylib

Now most games need static assets (such as sprites, audio, etc) in order to work and often times people will just ship the raw files as part of the game. I am personally not a huge fan of that
because I just want my games to be very portable, requiring just a single executable (and maybe a library if necessary).

There are many different ways of packaging files into executable binaries with C compilers but I don't have the knowledge nor the patience to set that up.

# Why not use a language with built in file packaging?
My favourite language is Go, I use it alot for personal projects because its very simple to use and can be quite powerful when used correctly.

One reason why I love it so much is `embed.FS`, a built in way to embed files as a variable in your code. The files get included in the binary at compile time and can be accessed through a similar
way to just reading them from the filesystem.

Now another neat thing about Go is the fact that the compiler can build Go binaries in a variety of formats, including C archives that can be linked into other C projects. The Go compiler
then creates a C archive with the code, and a C header file with all the definitions.

We then just have to tell gcc to link the code and include the header, and voila we have embedded files in our game thanks to Go.

Here is the Go code I used to make this work:
```go
package main

/*
#include <stdlib.h>
*/
import "C"
import (
        "embed"
        "fmt"
        "unsafe"
)

//go:embed all:assets
var AssetFiles embed.FS

//export LoadAsset
func LoadAsset(cpath *C.char, csize *C.int) *C.uchar {
        path := C.GoString(cpath)
        data, err := AssetFiles.ReadFile(path)
        if err != nil {
                fmt.Printf("ERROR: failed to load asset %s: %v\n", path, err)
                *csize = 0
                return nil
        }

        cdata := C.CBytes(data)
        *csize = C.int(len(data))
        return (*C.uchar)(cdata)
}

//export FreeAsset
func FreeAsset(cdata *C.char) {
        C.free(unsafe.Pointer(cdata))
}

func main() {}
```

# The one caveat
As easy as this seems, there is one trade off to using Go to handle embedded files. There is a bit of performance overhead when your code switches from your C code to the Go code as it needs
to setup the Go runtime (garbage collector, goroutines etc.).

So if you need to read file data every frame, this might not be the best option but in my case I just need to read the file data when the game loads because then I can pass the file data to
raylib and stay within C.
