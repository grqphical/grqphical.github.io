---
title: "cgraph"
cover:
    image: "/cgraph-bar-graph.png"
---

cgraph is a lightweight, single-header C99 library that generates simple graphs and charts without third-party dependencies. It renders directly into either a memory buffer or an image file, making it
extremely portable and completely cross platform.

[Github](https://github.com/grqphical/cgraph)

## Current Features
- Bar Graphs
- Pie Charts
- Exporting to PPM Images

The image above is an example of a bar graph made with cgraph. 

Here is an example of a pie chart made with cgraph:
![Pie Chart Example](/cgraph-pie-graph.png)


## Renderer

I built the rendering stack from scratch, which includes functionality for drawing primitive shapes onto images and text rendering using an 8x8 font stored as an array of bytes in C
that I sourced from [here](https://github.com/dhepper/font8x8). The renderer simply draws pixels into a buffer in memory rather than use a third-party renderer such as OpenGL, SDL, or raylib.

The renderer consists of a few components:

### First there is the image/colour structs that store the images in memory:
```c
typedef struct {
    char r;
    char g;
    char b;
} colour;

typedef struct {
    colour* pixels;
    int width;
    int height;
} image;
```

### Then there are methods to draw primitives onto said images

Here is a basic implementation of how cgraph draws rectangles:
```c
void draw_rectangle(image* img, int x_pos, int y_pos, int width, int height, colour c) {
    for (int x = x_pos; x < x_pos+width; x++) {
        for (int y = y_pos; y < y_pos+height; y++) {
            int rowOffset = y * img->width;
            img->pixels[rowOffset + x] = c;
        }
    }
}
```

### The graphs themselves simply hold the data about them
The only thing stored in the graph struct is the title of said graph and the data it contains. The actual image is only rendered once the user calls the render function
for the said graph.

### Finally, the render function generates an image that can be saved as a file or used by a graphics library
I plan to add support later on for PNG and JPEG images, but I chose PPM because I could easily build an encoder for PPM and focus more of my time on the library itself.
