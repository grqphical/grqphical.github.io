+++
title = 'rest.nvim'
+++

rest.nvim is a simple HTTP client for Neovim I made to help me test API's I build. I built the interface to be like you are edting a file, rest.nvim uses a simple markup language to define HTTP requests
and once the buffer is written, the plugin uses `curl` to send the HTTP request and then displays the results in a new buffer.

This is an example of the markup language:
```
url: https://httpbin.org/post
method: POST
header: Content-Type: application/json
body: {"foo":"bar"}
```

You can learn more at the projects [repo](https://github.com/grqphical/rest.nvim)
