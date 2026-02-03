---
tags:
    - S***box laptop server
title: Setting up a SMB share for my S***box Laptop Server
date: 2026-02-03T15:19:00+07:00
author: "Nathan Jacobson"
ShowBreadCrumbs: true
---
*This is part 6 of an article series. You can read the previous one [here](/posts/laptop-server-minecraft)*

So right now I have a web based interface called `filebrowser` that I use to access my files on my server. It works very well but it's annoying to have to use a web browser to
access my server's files.

I originally wanted to setup an SMB server on the SBLS (S***box Laptop Server) but the dorm network did not allow the SMB protocol over the local network.

But now since I'm using TailScale, I can do whatever the hell I want. My university's IT department will not stand in the way of me having an SMB server.

# Advantages of SMB
The nice thing about SMB is that it's fairly universal, so it works on every platform (Windows, MacOS, Linux, even IOS).

It also integrates with most OS's file browsers so file transfers are super easy to do

# Settting up an SMB server
I found another Docker image that hosts an SMB server for you [dockur/samba](https://github.com/dockur/samba).

Configuration is dead simple, you can easily set the username/password, share name, and the folder where it stores the files from within the `docker-compose.yml` file

Here is my `docker-compose.yml` for reference (they also have an example one in their repository linked above)
```yaml
services:
  samba:
    image: dockurr/samba
    container_name: samba
    environment:
      NAME: "Files"
      USER: "nathan"
      PASS: <readacted for obvious reason>
    ports:
      - 127.0.0.1:445:445
    volumes:
      - ./my-files:/storage
    restart: always
```

# How to access the server
## Windows
Open File Explorer, Go to "This PC", Right Click, Add a Network Location, select Choose a Custom Netork Location then enter `\\<your-server-address\your-share-name>` and then press
next. It will prompt you to login, just login with the credentials you set in the `docker-compose.yml` file

## IOS
Open the Files app, click the three dots in the top right corner, then click "Connect to Server". Enter in your server's IP/URL and click the checkmark.

Again it will prompt you to login, make sure to select Registered User at the top and then enter your credentials

If you want to connect on other platforms, I'm sure there are tutorials online for them I just gave the instructions for the platforms I use
