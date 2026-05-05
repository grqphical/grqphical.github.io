---
title: "rest.nvim"
---
This is a plugin for Neovim I created that allows users to easily send HTTP requests via a Vim buffer. It is written in Lua and uses cURL to power the HTTP requests.
Requests are defined using a simple markup language that allows you to define things such as the URL, request method, headers, and body of the request.

Here is an example of the markup language:
```
url: https://httpbin.org/post
method: POST
header: Content-Type: application/json
body: {"foo":"bar"}
```

You can view the project repository [here](https://github.com/grqphical/rest.nvim)