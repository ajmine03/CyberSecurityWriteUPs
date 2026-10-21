---
title: n0s4n1ty 1
date: 2026-10-20
platform: CyLab
category: Web Exploitation
difficulty: Easy
tags: ["Week03"]
notion_id: 3ff8b5aa-2f8e-80b5-a94a-e07b87b76620
---

# n0s4n1ty 1

<div class="article-meta-badges">
  <span class="meta-badge meta-badge--platform"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> CyLab</span>
  <span class="meta-badge meta-badge--category"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg> Web Exploitation</span>
  <span class="meta-badge meta-badge--difficulty"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg> Easy</span>
  <span class="meta-badge meta-badge--date"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> 2026-10-20</span>
</div>

Web Exploitation `Easy` pico2025


!!! tip "Note ⚙"
    A developer has added profile picture upload functionality to a website. However, the implementation is flawed, and it presents an opportunity for you. Your mission, should you choose to accept it, is to navigate to the provided web page and locate the file upload area. Your ultimate goal is to find the hidden flag located in the **`/root`** directory.

Lets start : accroding to descriptions, the upload is vernable maybe i need php upload revershell .


![Image](../assets/notion/nosanity/img_a5b0d880a3cd.png)

setting up Listener , 

* `l`: Listen mode.
* `v`: Verbose output.
* `n`: Do not resolve DNS names (speeds up the connection).
* `p 4444`: The port number you will specify in your PHP script.
Saved the following template as rev.php and upload . php working but not connecting to my pc. maybe beacuse of private ip eventhough i used vpn but same problm !!

So i write a basic script to check echo works or not: 

`<?php
// This is a single-line comment
echo "Hello, World!";
?>`


![Image](../assets/notion/nosanity/img_9d75daccac0c.png)

and its working ! now need to access now checking echo shell_exec('whoami'); this work or not, YESS works. 

now using sudo -l as the hint mentioned !


![Image](../assets/notion/nosanity/img_6c3b653ea0bc.png)

using sudu ls /root i found flag.txt


![Image](../assets/notion/nosanity/img_2364e6b7f992.png)

and found the flag.


![Image](../assets/notion/nosanity/img_f6abcc74969e.png)
