# Web Enumeration

## Section Summary

**Web Enumeration** হলো কোনো web server বা web application সম্পর্কে যতটা সম্ভব useful information সংগ্রহ করার একটি structured process। Service scanning-এর সময় `80` ও `443` port-এ web server পাওয়া খুব common। একটি web server-এর পেছনে একাধিক web application থাকতে পারে, এবং সেগুলো penetration testing-এর সময় গুরুত্বপূর্ণ attack surface হতে পারে।

এই section-এর মূল লক্ষ্য হলো:

- Web application-এর hidden **files/directories** খুঁজে বের করা
- **Subdomain** discover করা
- Web server-এর **headers/banner** থেকে technology সম্পর্কে জানা
- Web application-এর technology stack fingerprint করা
- **SSL/TLS certificate** থেকে additional information সংগ্রহ করা
- `robots.txt` দেখে hidden/private path সম্পর্কে clue পাওয়া
- Web page-এর **source code** পরীক্ষা করা

> এই notes-গুলো provided HTB section-এর content অনুযায়ী তৈরি। এখানে example IP/domain-গুলোও source-এর মতোই রাখা হয়েছে।

---

## 1. Directory/File Enumeration

Web application discover করার পর hidden files ও directories খোঁজা গুরুত্বপূর্ণ। Source-এ `GoBuster` এবং `ffuf`-কে directory enumeration-এর জন্য উল্লেখ করা হয়েছে।

`GoBuster`-এর `dir` mode wordlist ব্যবহার করে বিভিন্ন path request করে এবং interesting HTTP response শনাক্ত করতে সাহায্য করে।

### Example

```bash
gobuster dir -u http://10.10.10.121/ -w /usr/share/seclists/Discovery/Web-Content/common.txt
```

এখানে:

- `dir` → directory/file brute-forcing mode
- `-u` → target URL
- `-w` → wordlist

Example output-এ:

- `200` → request successful
- `403` → resource আছে/response পাওয়া গেছে, কিন্তু access forbidden
- `301` → redirect

Source-এর scan `/wordpress` path discover করেছিল। Browser-এ সেটি WordPress setup mode-এ ছিল, যা source অনুযায়ী server-এ RCE পাওয়ার সম্ভাবনা তৈরি করেছিল।

---

## 2. DNS Subdomain Enumeration

একটি domain-এর গুরুত্বপূর্ণ application বা admin panel subdomain-এর মধ্যে থাকতে পারে।

`GoBuster`-এর `dns` mode ব্যবহার করে wordlist দিয়ে subdomain enumerate করা যায়।

```bash
gobuster dns -d inlanefreight.com -w /usr/share/SecLists/Discovery/DNS/namelist.txt
```

Example-এ পাওয়া যায়:

```text
blog.inlanefreight.com
customer.inlanefreight.com
my.inlanefreight.com
ns1.inlanefreight.com
ns2.inlanefreight.com
ns3.inlanefreight.com
```

এগুলো পরে আলাদাভাবে examine করা যায়।

---

## 3. SecLists

`SecLists` হলো fuzzing ও enumeration-এর জন্য useful wordlist collection। Source-এ এটি clone অথবা package হিসেবে install করার দুইটি পদ্ধতি দেখানো হয়েছে।

### Git দিয়ে clone

```bash
git clone https://github.com/danielmiessler/SecLists
```

### APT দিয়ে install

```bash
sudo apt install seclists -y
```

এরপর DNS enumeration-এর জন্য source-এ এই wordlist ব্যবহার করা হয়েছে:

```text
/usr/share/SecLists/Discovery/DNS/namelist.txt
```

---

## 4. Web Server Headers / Banner Grabbing

Web server-এর response headers থেকে server, framework, authentication option এবং security configuration সম্পর্কে clue পাওয়া যেতে পারে।

Source-এ `cURL` দিয়ে headers দেখা হয়েছে:

```bash
curl -IL https://www.inlanefreight.com
```

Example response:

```text
HTTP/1.1 200 OK
Server: Apache/2.4.29 (Ubuntu)
Content-Type: text/html; charset=UTF-8
```

এখানে `Server` header থেকে Apache এবং version সম্পর্কে information পাওয়া যাচ্ছে।

---

## 5. EyeWitness

`EyeWitness` web applications-এর screenshot নিতে, fingerprint করতে এবং possible default credentials identify করতে সাহায্য করতে পারে।

Source-এ এটি web enumeration-এর একটি useful supporting tool হিসেবে উল্লেখ করা হয়েছে।

---

## 6. WhatWeb

`WhatWeb` web server, supporting framework এবং application-এর technology fingerprint করতে ব্যবহৃত হয়।

### Single target

```bash
whatweb 10.10.10.121
```

Source-এর example-এ Apache, Ubuntu এবং PHP version-এর মতো information পাওয়া যায়।

### Network range

```bash
whatweb --no-errors 10.10.10.0/24
```

এটি একটি network range-এর web targets সম্পর্কে technology information collect করতে পারে।

---

## 7. SSL/TLS Certificates

HTTPS ব্যবহার করলে SSL/TLS certificate useful information source হতে পারে।

Certificate-এর মধ্যে organization name, email address এবং issuer/subject-related information থাকতে পারে। Source অনুযায়ী assessment-এর scope-এর মধ্যে থাকলে এই information security testing-এর জন্য useful হতে পারে।

---

## 8. robots.txt

`robots.txt` মূলত search-engine crawler-কে কোন resource index করা উচিত বা উচিত নয় তা জানাতে ব্যবহৃত হয়।

কিন্তু enumeration-এর সময় এটি useful clue দিতে পারে, কারণ এখানে private files বা admin pages-এর path উল্লেখ থাকতে পারে।

Source-এর example-এ `robots.txt` থেকে:

```text
/private
/uploaded_files
```

এর মতো disallowed path পাওয়া যায়। `/private` visit করলে একটি HTB admin login page পাওয়া যায়।

---

## 9. Source Code

Web page-এর source code-ও inspect করা উচিত।

Browser-এ সাধারণভাবে:

```text
CTRL + U
```

ব্যবহার করে page source দেখা যায়।

Source-এর example-এ developer comment-এর মধ্যে test-account credentials পাওয়া গিয়েছিল। তাই HTML/source code-এ comments, metadata এবং accidentally exposed information-এর দিকে নজর দেওয়া গুরুত্বপূর্ণ।

---

## Enumeration Mindset

একটি web target enumerate করার সময় শুধু homepage দেখে থেমে যাওয়া উচিত নয়। এই section থেকে একটি practical flow:

```text
Web Service Found
      |
      +--> Directory/File Enumeration
      |
      +--> DNS/Subdomain Enumeration
      |
      +--> HTTP Headers
      |
      +--> Technology Fingerprinting
      |
      +--> SSL/TLS Certificate
      |
      +--> robots.txt
      |
      +--> Page Source
```

প্রতিটি result পরবর্তী enumeration step-এর জন্য নতুন clue দিতে পারে।

---

## Important HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | Request successful |
| `301` | Redirect |
| `403` | Access forbidden |

এই section-এ enumeration result বুঝতে বিশেষভাবে `200`, `301`, এবং `403` ব্যবহৃত হয়েছে।

---

## Key Takeaways

1. Web server পাওয়া মানেই শুধু homepage পরীক্ষা করা নয়।
2. Hidden directories/files গুরুত্বপূর্ণ functionality বা sensitive data expose করতে পারে।
3. Subdomain-এ আলাদা application বা admin panel থাকতে পারে।
4. HTTP headers technology এবং server configuration সম্পর্কে clue দিতে পারে।
5. `WhatWeb` technology fingerprinting দ্রুত করতে পারে।
6. SSL/TLS certificate থেকে organization-related information পাওয়া যেতে পারে।
7. `robots.txt` hidden/private path-এর clue দিতে পারে।
8. Source code-এ developer comments বা accidentally exposed credentials থাকতে পারে।
