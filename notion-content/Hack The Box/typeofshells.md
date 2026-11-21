---
title: Types of Shells
date: 2026-11-21
platform: Hack The Box
category: Getting Started
difficulty: Easy
notion_id: 41f8b5aa-2f8e-80a8-8656-c00cfcff9631
---

# Types of Shells

<div class="article-meta-badges">
  <span class="meta-badge meta-badge--platform"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> Hack The Box</span>
  <span class="meta-badge meta-badge--category"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg> Getting Started</span>
  <span class="meta-badge meta-badge--difficulty"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg> Easy</span>
  <span class="meta-badge meta-badge--date"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> 2026-11-21</span>
</div>

**Types of Shells**

There are sevaral method to gain access or execute command remotely on a pc : Shell is one of them.


| Type of Shell | Method of Communication |
| --- | --- |
| `Reverse Shell` | Connects back to our system and gives us control through a reverse connection. |
| `Bind Shell` | Waits for us to connect to it and gives us control once we do. |
| `Web Shell` | Communicates through a web server, accepts our commands through HTTP parameters, executes them, and prints back the output. |

<u>**Reverse Shell :**</u>

usally uses netcat to listening, `nc -lvnp 1234 `

| Flag | Description |
| --- | --- |
| `-l` | Listen mode, to wait for a connection to connect to us. |
| `-v` | Verbose mode, so that we know when we receive a connection. |
| `-n` | Disable DNS resolution and only connect from/to IPs, to speed up the connection. |
| `-p 1234` | Port number `netcat` is listening on, and the reverse connection should be sent to. |

`ip a`

3: tun0: <POINTOPOINT,MULTICAST,NOARP,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state 
Here tun0 is a vpn of htb !

reverseshell [Command](https://swisskyrepo.github.io/InternalAllTheThings/cheatsheets/shell-reverse-cheatsheet/#python)

<u>**Bind Shell:**</u>

Once again, we can utilize [Payload All The Things](https://swisskyrepo.github.io/InternalAllTheThings/cheatsheets/shell-bind-cheatsheet/) to find a proper command to start our bind shell


![Image](../assets/notion/typeofshells/img_1538aed99200.png)


![Image](../assets/notion/typeofshells/img_ea3853e93f2f.png)

<u>**Web Shell:**</u>


![Image](../assets/notion/typeofshells/img_8bacfb2d4d58.png)

| Web Server | Default Webroot |
| --- | --- |
| `Apache` | /var/www/html/ |
| `Nginx` | /usr/local/nginx/html/ |
| `IIS` | c:\inetpub\wwwroot\ |
| `XAMPP` | C:\xampp\htdocs\ |
