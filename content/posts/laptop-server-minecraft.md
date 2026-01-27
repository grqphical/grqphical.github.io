---
tags:
    - S***box laptop server
title: Hosting a Minecraft Java server on the S***box Laptop Server 
date: 2026-01-23T16:22:00+07:00
author: "Nathan Jacobson"
ShowBreadCrumbs: true
---
*This is part 5 of an article series. You can read the previous one [here](/posts/laptop-server-tailscale)*

My friends and I were wanting to have our own Minecraft Java server to play on but we didn't want to pay a hosting service to host it. So I decided to see if the S\*\*\*box Laptop Server
can run a Minecraft Java Server.The S***box Laptop Server was a gaming laptop so it has fairly decent resources that are just sitting there (because a file server barely uses any resources lol)

## How do you run a Minecraft Server?
At first I was just going to download the server binary, create a systemd service and just run it. This takes alot of manual intervention and I would rather just have it run in the
background no matter what.

Then I found: [this](https://github.com/itzg/docker-minecraft-server), an all-in-one Docker container that runs a Minecraft server with tons of configuration options such as: what server binary to use (vanilla, paper, forge, etc.), 
how much RAM the server should have, what mods/plugins should be installed and so much more. There are so many configuration options, that there exists a website that creates a Docker
compose file for you based on what you need, you can find it [here](https://setupmc.com/java-server/).

This made setting up the server super easy and within a few minutes it was up and running.

## How can we access it from the public internet
Now the next logical step would be to port forward so that others who don't live in my building can play on the server. However, I live in a dorm where I can't access the router to
port forward the server, and I don't think IT would even read an email asking them to do it.

What I needed is a way to tunnel the server to the public internet.

## Can we use TailScale?
Short answer, no.

Long answer, yes, but everyone would have to install the TailScale client and I would need to give them my login which I do not want to do. It's both a hassle for the players and
a security risk for me.

So what can I use instead?
## playit.gg
playit.gg is a service that is made for tunneling game servers, and they even have a configuration for Minecraft Java. 

Setup was just as simple as TailScale, create account, install client, create tunnel to port 25565 (default port of MC Java) and you get a URL that can be accessed from the public internet.

**One thing I highly reccommend when setting up playit:** make sure to run every command to set it up with `sudo`, because this will save the authentication information in a place
that the systemd service playit.gg creates can access it so the tunnel will always restart and always run in the background.

## My server configuration
I didn't need much for my server, all I setup was a whitelist and a few performance mods.

Here is my Docker compose file:
```yaml
services:
  mc:
    image: itzg/minecraft-server:latest
    container_name: mc-server
    tty: true
    stdin_open: true
    restart: always
    ports:
      - "25565:25565"
    environment:
      EULA: "TRUE"
      TYPE: "FABRIC"
      MEMORY: "2048M"
      MAX_PLAYERS: "30"
      ONLINE_MODE: "true"
      MOTD: "My Server"
      TZ: "America/Vancouver"
      ENABLE_WHITELIST: "true"
      ICON: "/data/logo.png"
      WHITELIST: |-
        players here... 
      OPS: |-
        operators here...
      MODRINTH_PROJECTS: |-
        # Just a few performance/QOL mods
        P7dR8mSH
        WTzuSu8P
        Ps1zyz6x
        c7m1mi73
        VSNURh3q
        Wnxd13zP
        gvQqBUqZ
        uXXizFIs
    volumes:
      - "./data:/data"
```

## Automatic Server Restarts
One thing I like to have with my MC servers is some way for the servers to automatically restart at midnight each night. I find this helps with performance by getting rid of entites,
items on the ground etc. So I need someway to schedule a cron job that runs a script that notifies the players that the server is restarting and then restarts it.

I could just do that on the host system and run `docker stop mc-server` but then it would forcibly shutdown the server, causing some world data to be lost.

Luckily Minecraft supports the `rcon` (remote console) protocol so I can have another container run commands to safely shutdown the server and notify the players.

I wrote this basic bash script:
```bash
#!/bin/bash
docker exec -d mc-server rcon-cli say "Server Restarting in 15 Seconds"
sleep 15
docker exec -d mc-server rcon-cli say "Server Restarting..."
docker exec -d mc-server rcon-cli stop
```

Then I just ran it as a cron job in another Docker container, with the Docker Engine socket mounted to it and the Docker CLI installed.

The final Docker Compose script looks something like this:
```yaml
services:
  mc:
    image: itzg/minecraft-server:latest
    container_name: mc-server
    tty: true
    stdin_open: true
    restart: always
    ports:
      - "25565:25565"
    environment:
      EULA: "TRUE"
      TYPE: "FABRIC"
      MEMORY: "2048M"
      MAX_PLAYERS: "30"
      ONLINE_MODE: "true"
      MOTD: "My Server"
      TZ: "America/Vancouver"
      ENABLE_WHITELIST: "true"
      ICON: "/data/logo.png"
      WHITELIST: |-
        players here... 
      OPS: |-
        operators here...
      MODRINTH_PROJECTS: |-
        # Just a few performance/QOL mods
        P7dR8mSH
        WTzuSu8P
        Ps1zyz6x
        c7m1mi73
        VSNURh3q
        Wnxd13zP
        gvQqBUqZ
        uXXizFIs
    volumes:
      - "./data:/data"
  # Daily Restarter Service
  restarter:
    image: docker:cli
    container_name: mc-restarter
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /etc/localtime:/etc/localtime:ro
      - /etc/timezone:/etc/timezone:ro
      - "./scripts:/scripts"
    entrypoint: ["/bin/sh", "-c"]
    command:
      - |
        echo "0 0 * * * source /scripts/restart.sh" > /etc/crontabs/root
        crond -f -L /dev/stdout
```
