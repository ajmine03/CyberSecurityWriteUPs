---
title: Old Sessions
date: 2026-10-20
platform: CyLab
category: Web Exploitation
difficulty: Easy
tags: ["Week03"]
notion_id: 3ff8b5aa-2f8e-80c8-b9be-f8813c2ec8b4
---

# Old Sessions

<div class="article-meta-badges">
  <span class="meta-badge meta-badge--platform"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg> CyLab</span>
  <span class="meta-badge meta-badge--category"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg> Web Exploitation</span>
  <span class="meta-badge meta-badge--difficulty"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg> Easy</span>
  <span class="meta-badge meta-badge--date"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> 2026-10-20</span>
</div>

`Easy` picoCTF 2026

Descriptions : 


!!! tip "Note 💡"
    Proper session timeout controls are critical for securing user accounts. If a user logs in on a public or shared computer but doesn’t explicitly log out (instead simply closing the browser tab), and session expiration dates are misconfigured, the session may remain active indefinitely.

The session expire date leading to cookies ! 
Ok in the browser , theres login and registration option . I register with with user , pass : and login


![Image](../assets/notion/old-sessions/img_a030fa11493b.png)

I found ADMIN comment , and cookies of my id . 


![Image](../assets/notion/old-sessions/img_8edb8f6ae6ba.png)

OHH! I missed a strange comment by mary_jones


![Image](../assets/notion/old-sessions/img_2e4411fd34f7.png)

In that page i found admin cookies

 1) session:`pdQcI8hN6T0daaqZkThhaeB9frzGAF8iMWXTfONYF8Q`, {'_permanent': True, 'key': 'admin'}

changed the cookies of my login id to admin cookies 


![Image](../assets/notion/old-sessions/img_3725ac135543.png)

and Im in 


![Image](../assets/notion/old-sessions/img_78a9e0f969c0.png)
