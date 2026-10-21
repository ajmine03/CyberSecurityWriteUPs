---
title: Crack The Gate 1
date: 2026-10-20
platform: CyLab
category: Web Exploitation
difficulty: Easy
tags: ["Week03"]
notion_id: 3ff8b5aa-2f8e-8093-8fee-eb3d0a197352
---

# Crack The Gate 1

<div class="article-meta-badges">
  <span class="meta-badge meta-badge--platform"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> CyLab</span>
  <span class="meta-badge meta-badge--category"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg> Web Exploitation</span>
  <span class="meta-badge meta-badge--difficulty"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg> Easy</span>
  <span class="meta-badge meta-badge--date"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> 2026-10-20</span>
</div>

!!! tip "Note 💡"
    We’re in the middle of an investigation. One of our persons of interest, ctf player, is believed to be hiding sensitive data inside a restricted web portal. We’ve uncovered the email address he uses to log in: **`ctf-player@cylabacademy.org`**. Unfortunately, we don’t know the password, and the usual guessing techniques haven’t worked. But something feels off... it’s almost like the developer left a secret way in. Can you figure it out?



There is a login page and i dont know the password ! In source code page I found something



![Image](../assets/notion/crack-the-gate-1/img_2552aa0626c4.png)

I google about Hint 02 and found ROT13 decoder :



![Image](../assets/notion/crack-the-gate-1/img_d4618514b7a9.png)

I dont know about header usages !!! So ive to analysis

i use a extension to add header 


![Image](../assets/notion/crack-the-gate-1/img_023e2604e085.png)

and try too loggin with that email and rand pass !



![Image](../assets/notion/crack-the-gate-1/img_57cb82c01eb4.png)

GOT IT
