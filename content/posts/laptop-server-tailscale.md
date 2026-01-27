---
tags:
    - S***box laptop server
title: Setting up a VPN for the S***box laptop server 
date: 2026-01-18T13:10:00+07:00
author: "Nathan Jacobson"
ShowBreadCrumbs: true
---
*This is part 4 of an article series. You can read the previous one [here](/posts/laptop-server-monitoring)*

Happy new year everyone! I know I haven't been posting much on this site, I have just been busy with university. I'll try to update the site more often.

So a friend of mine reccomended I setup a VPN for my homelab as it is way more secure than just exposing the ports on the university dorm network. They reccomended WireGuard which
seems easy enough to setup and only requires a single UDP port; however I am unsure if the university is ok with me running a WireGuard server from my dorm, so I don't want to risk
angering the IT department.

## Enter TailScale
So after doing some research I discovered TailScale, basically a VPN Mesh Network, except the main exit node is hosted at their data center rather than locally. Any device connected to the 
to the network is basically just connected to a VPN, which is allowed in the university's internet policy. Also TailScale is Canadian so it's great to support Canadian busineses.

*Note: TailScale is not sponsoring this at all, I just geniunely found it to be a good service*

To set it up, you make an account and download the client onto all your devices. So I installed it on my main laptop, the s\*\*\*box laptop server, and my phone. Once you have all
your devices added, each one is assigned an IP address you can directly connect to without being on the same internet. TailScale also has a DNS built in, so if your device was named
`shitbox-laptop-server` you could just go to `https://shitbox-laptop-server` and it would connect you to whatever service was running on the HTTP port.

## Reverse Proxy?
Now I didn't want to have all my different services running on different ports, I wanted to be able to go to unique subdomains to access them. At first I thought about running
something like Nginx Proxy Manager but then discovered that TailScale has a new feature called
*Services*. TailScale Services act as a reverse proxy manager, you choose the name/URL of the service, what port it should connect to, and then expose that port with the TailScale client
on said device and then you can access that service at the subdomain. Every tailscale network comes with a domain that can be used to access different devices (For example: *tail12345f.ts.net*)
and each service/device gets it's own subdomain.

For example, I created a "dashboard" service that connects to my server's dashboard. I called the service "dashboard" (so the URL would be `https://dashboard.tail12345f.ts.net`), then
ran this command on the server:
```bash
sudo tailscale serve --service=svc:dashboard --https=443 127.0.0.1:3001
```
The `--https` flag tells TailScale that the service is an HTTPS service, so it automatically handles TLS certificates and proxying requests. The address at the end is the local
address of the service, in this case my dashboard is running on port `3001` on `localhost`

You can read more in the CLI's help menu, but for reference you can also do `--http` for HTTP services (no TLS) or `--tcp` for any type of TCP servic

And you can only expose the ports on localhost (127.0.0.1) which means no one else on your network can access them.

## Conclusion
I highly reccomend using TailScale if you're either unable to or don't want to setup a WireGuard server. It makes things super easy and has great documentation.

Next post, I am going to be setting up a Minecraft Java Server for my friends and I to play on
