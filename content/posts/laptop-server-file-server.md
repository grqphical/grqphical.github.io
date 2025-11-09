---
tags:
    - S***box laptop server
title: Adding file sharing to my laptop home server
date: 2025-11-09T15:27:00+07:00
author: "Nathan Jacobson"
ShowBreadCrumbs: true
---

*This is part 2 of an article series. You can read the previous one [here](/posts/laptop-server)*

So now that I have a working server running Debian, we need to actually run useful things on it, otherwise it's a hunk of plastic sipping electricity under my bed. Why not start with something simple, getting a file server running on here so I can transfer files to/from it. I mean the laptop has 1 TB of storage so I might as well use it.

## Time to do the Samba

In order to create a file server that can be easily accessed from Windows, MacOS, Linux, and even IOS, I need to create an SMB (Server Message Block) share and there exists a piece of software called `samba` that sets this up for you.

And oh my god does it make it easy for you. All I had to do basically install it, make a folder, change some permissions, edit one config file, and run it. Then boom, I now have a file server I can store/retrieve files from.

Heres exactly what I did to set it up:

1. Installed samba:

```bash
sudo apt update
sudo install samba -y
```

2. Create the directory to store the files

It's easiest to store it in samba's `srv` directory, but theoretically you could store it anywhere

```bash
sudo mkdir -p /srv/samba/file-server

sudo chown -R user:user /srv/samba/file-server
sudo chmod -R 0775 /srv/samba/file-server
```

3. Edit the config file

Open `/etc/samba/samba.conf` (make sure you do this with `sudo`) and paste this in

```toml
[ShareName]
   comment = My Shared Folder
   path = "/srv/samba/file-server"
   browseable = yes
   writable = yes
   guest ok = no
   valid users = user
   create mask = 0664
   directory mask = 0775
```

4. Create a samba user:

```bash
sudo smbpasswd -a user
```

5. Finally restart the service

```bash
sudo systemctl restart smbd
```

Now you can connect to it from almost any device. On Windows you'll have to open Explorer, right click on This PC, click `Add a Network Location`, go through the prompts, then enter `\\yourserver'sIP\yoursharename` for the address, login with your username and password you set in step 4, and you can now access it.