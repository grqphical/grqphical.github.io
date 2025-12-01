---
tags:
    - S***box laptop server
title: How to monitor your S*** box Laptop Server
date: 2025-11-30T15:27:00+07:00
author: "Nathan Jacobson"
ShowBreadCrumbs: true
---

*This is part 3 of an article series. You can read the previous one [here](/posts/laptop-server-file-server)*

So now that the server can store files, I want to be able to easily monitor it without needing to SSH into it or dig the laptop out from underneath my bed

Time to add a monitoring service, preferably with a web interface.

## dash

Looking through [awesome-selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted) (great resource, highly recommend for anyone looking for things to run on their home server) I found
a project called [dash](https://getdashdot.com/), a ligthweight web app that allows you to remotely monitor your server.

![dash interface](https://getdashdot.com/img/screenshot_darkmode.png)
*Source: https://getdashdot.com/*

It's very limited in features, only showing resource utilization but that's all I really needed.

And it has a Docker image so setup/install is super easy. Once I got the image and spun up the container, it was running.

## The new problem

I now have multiple HTTP servers running on my server, but since I can only use port 80, I can only have one active at the same time. So next article I'll be setting up a reverse proxy
