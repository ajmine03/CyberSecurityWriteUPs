# Web Enumeration Checklist

এই checklist provided section-এর key points থেকে তৈরি।

## 1. Web Service

- [ ] `80` / `443`-এ web server আছে কি?
- [ ] Web application identify করা হয়েছে কি?

## 2. Directory/File Enumeration

- [ ] `GoBuster` `dir` mode ব্যবহার করা হয়েছে?
- [ ] Appropriate wordlist ব্যবহার করা হয়েছে?
- [ ] `200`, `301`, `403` results review করা হয়েছে?

## 3. Subdomain Enumeration

- [ ] `GoBuster` `dns` mode ব্যবহার করা হয়েছে?
- [ ] `SecLists` DNS wordlist ব্যবহার করা হয়েছে?
- [ ] Discovered subdomain-গুলো আলাদাভাবে examine করা হয়েছে?

## 4. Headers

- [ ] `cURL` দিয়ে HTTP headers দেখা হয়েছে?
- [ ] Server/version information নোট করা হয়েছে?

## 5. Technology Fingerprinting

- [ ] `WhatWeb` চালানো হয়েছে?
- [ ] Server/framework/application information নোট করা হয়েছে?

## 6. Supporting Recon

- [ ] `EyeWitness` দিয়ে screenshots/fingerprinting দরকার কি?
- [ ] SSL/TLS certificate review করা হয়েছে?
- [ ] `robots.txt` check করা হয়েছে?
- [ ] Page source inspect করা হয়েছে?

## Final Mindset

```text
Discover
   ↓
Enumerate
   ↓
Fingerprint
   ↓
Collect Clues
   ↓
Investigate Interesting Findings
```
