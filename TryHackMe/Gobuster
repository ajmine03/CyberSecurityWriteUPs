# TryHackMe — Gobuster: The Basics

> **Path:** Cyber Security 101 → Offensive Security Tooling  
> **Room:** Gobuster: The Basics  
> **Purpose:** Personal Recap / Revision Notes  
> **Focus:** Web Enumeration, Directory Discovery, Subdomains & Virtual Hosts

---

## 1. Gobuster in a Nutshell

Gobuster is an open-source enumeration utility written in Go. During reconnaissance, it helps discover web resources that may not be visible through normal navigation.

The room concentrates on three important modes: `dir` for directories and files, `dns` for subdomains, and `vhost` for virtual hosts. ([tryhackme.com](https://tryhackme.com/room/gobusterthebasics)) 

```text
dir    → Directory / File enumeration
dns    → Subdomain enumeration
vhost  → Virtual Host enumeration
```

The overall idea is simple: provide Gobuster with a list of possible names, let it send the relevant requests, and investigate the responses that stand out.

---

## 2. Enumeration and Wordlists

A website can expose resources that aren't linked from its visible pages:

```text
/
/admin
/login
/uploads
/assets
/private
/config
/backup
```

Manually checking every possibility is inefficient. Gobuster automates this by taking candidate names from a wordlist.

```text
Wordlist
   ↓
Gobuster
   ↓
Requests
   ↓
Target
   ↓
Responses
   ↓
Interesting resources
```

A wordlist is simply a text file containing names that Gobuster will try.

For example:

```text
admin
login
backup
uploads
images
private
dev
test
```

A commonly used SecLists location on the AttackBox is:

```text
/usr/share/wordlists/SecLists/
```

For web-content discovery, useful lists include:

```text
/usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt
```

and:

```text
/usr/share/wordlists/SecLists/Discovery/Web-Content/directory-list-2.3-medium.txt
```

A larger wordlist can uncover more possibilities, but it also means more requests and potentially longer scans.

---

## 3. Start by Checking the Help

Before scanning, it is useful to inspect Gobuster's available options:

```bash
gobuster --help
```

Each mode also has its own help:

```bash
gobuster dir --help
```

```bash
gobuster dns --help
```

```bash
gobuster vhost --help
```

Some options apply broadly:

| Option | Purpose |
|---|---|
| `-t` | Number of concurrent threads |
| `-w` | Wordlist |
| `-o` | Output file |
| `--delay` | Delay between requests |

For example:

```bash
-t 10
```

controls concurrent requests, while:

```bash
-o results.txt
```

writes the results to a file.

A delay can be introduced with:

```bash
--delay 500ms
```

This can be useful when dealing with rate limiting.

---

## 4. Directory and File Discovery

For normal web content enumeration, use the `dir` mode.

The basic form is:

```bash
gobuster dir -u "http://TARGET" -w /path/to/wordlist
```

A practical example is:

```bash
gobuster dir \
  -u "http://TARGET" \
  -w /usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt
```

Here:

```text
gobuster
    ↓
Launch the tool

dir
    ↓
Directory/file mode

-u
    ↓
Target URL

-w
    ↓
Wordlist
```

Gobuster takes entries from the wordlist and checks paths such as:

```text
http://TARGET/admin
http://TARGET/login
http://TARGET/uploads
http://TARGET/backup
http://TARGET/images
```

It then reports useful characteristics of the responses.

---

## 5. Understanding HTTP Responses

When reading Gobuster output, don't focus exclusively on `200`.

Some common status codes are:

| Code | Meaning |
|---|---|
| `200` | OK / resource exists |
| `201` | Created |
| `301` | Permanent redirect |
| `302` | Temporary redirect |
| `401` | Authentication required |
| `403` | Forbidden |
| `404` | Not Found |
| `500` | Server Error |

For example:

```text
/admin       → 301
/login       → 200
/private     → 403
/notfound    → 404
```

A `403` response can still be valuable because it may indicate that a resource exists but access is restricted.

Response size can also help distinguish a genuine result from a generic error page when multiple paths return the same status code.

---

## 6. Searching for Specific File Types

Sometimes directory discovery isn't enough because interesting resources are files rather than directories.

Gobuster's `-x` option allows extensions to be specified:

```bash
gobuster dir \
  -u "http://TARGET" \
  -w /path/to/wordlist \
  -x php,txt,html
```

This makes Gobuster test combinations such as:

```text
/admin.php
/login.php
/backup.txt
/index.html
```

So the simple rule is:

```text
-x
 ↓
Search additional file extensions
```

---

## 7. Redirects and HTTPS

Gobuster can follow redirects with:

```bash
-r
```

For example:

```bash
gobuster dir \
  -u "http://TARGET" \
  -w /path/to/wordlist \
  -r
```

For HTTPS targets, lab certificates may not always validate normally. Gobuster can skip TLS certificate verification with:

```bash
-k
```

or:

```bash
--no-tls-validation
```

Example:

```bash
gobuster dir \
  -u "https://TARGET" \
  -w /path/to/wordlist \
  -k
```

Use this where appropriate for a controlled lab or authorized testing environment.

---

## 8. Limiting the Displayed Status Codes

The `-s` option lets you specify which status codes Gobuster should display.

For example:

```bash
-s 200,301,302
```

This can reduce noisy output and make a large scan easier to review.

Conceptually:

```text
All responses
      ↓
Status filtering
      ↓
Selected responses
```

---

## 9. What Should You Investigate?

A scan might reveal endpoints such as:

```text
/admin
/login
/private
/uploads
/backup
/dev
/test
/config
/.git
robots.txt
sitemap.xml
*.log
*.bak
```

These findings are not automatically vulnerabilities. They are simply pieces of the target's attack surface that may deserve additional investigation.

---

## 10. Subdomain Enumeration with DNS

Web applications often have more than one hostname:

```text
example.thm
www.example.thm
dev.example.thm
admin.example.thm
blog.example.thm
```

Gobuster's `dns` mode can be used to search for subdomains.

Basic syntax:

```bash
gobuster dns \
  -d example.thm \
  -w /path/to/wordlist
```

Here:

```text
dns
 ↓
DNS enumeration mode

-d
 ↓
Target domain

-w
 ↓
Subdomain wordlist
```

Gobuster tries names such as:

```text
admin.example.thm
dev.example.thm
test.example.thm
mail.example.thm
```

and checks whether they resolve.

The underlying process is:

```text
Wordlist
   ↓
Gobuster DNS
   ↓
DNS queries
   ↓
Resolved names
   ↓
Potential subdomains
```

---

## 11. Directory vs Subdomain

These two concepts should not be mixed up.

A directory looks like:

```text
example.thm/admin
```

while a subdomain looks like:

```text
admin.example.thm
```

The difference is:

```text
Directory
   ↓
HTTP
   ↓
Path on the web server
```

versus:

```text
Subdomain
   ↓
DNS
   ↓
Hostname / IP resolution
```

A subdomain may therefore lead to a completely different application even when the primary website looks normal.

---

## 12. Virtual Hosts

A virtual host is another way multiple websites can be served from the same IP address.

For example:

```text
10.10.10.10
     │
     ├── app.example.thm
     ├── admin.example.thm
     └── dev.example.thm
```

The web server can decide which site to serve based on the HTTP `Host` header.

Gobuster has a dedicated mode for this:

```text
vhost
```

A basic scan looks like:

```bash
gobuster vhost \
  -u "http://example.thm" \
  -w /path/to/wordlist
```

Conceptually, Gobuster tries hostnames such as:

```text
Host: admin.example.thm
Host: dev.example.thm
Host: test.example.thm
```

and observes how the server responds.

---

## 13. Subdomain and Vhost Are Not the Same

The distinction is worth memorising:

| Technique | Mode | What is being discovered? | Mechanism |
|---|---|---|---|
| Directory enumeration | `dir` | Paths/files | HTTP |
| Subdomain enumeration | `dns` | Subdomains | DNS |
| Vhost enumeration | `vhost` | Websites on the same IP | HTTP `Host` header |

A compact memory aid:

```text
DIR
 ↓
Path

DNS
 ↓
Subdomain

VHOST
 ↓
Website selected by Host header
```

A subdomain is resolved through DNS, whereas a virtual host is selected by the web server after receiving the HTTP request.

---

## 14. Lab DNS Configuration

Some TryHackMe environments use a local DNS service so that lab domains resolve correctly.

The required setup can involve adding:

```text
nameserver MACHINE_IP
```

to:

```text
/etc/resolv-dnsmasq
```

The reason is straightforward:

```text
dev.target.thm
      ↓
DNS lookup
      ↓
Lab DNS server
      ↓
MACHINE_IP
```

Without the appropriate DNS configuration, the hostname may fail to resolve.

---

## 15. A Practical Enumeration Strategy

A sensible reconnaissance sequence can combine manual discovery with automated scanning:

```text
                 TARGET
                   │
                   ↓
            Manual Discovery
                   │
          ┌────────┼────────┐
          ↓        ↓        ↓
       robots   sitemap   headers
          │
          ↓
      Gobuster
          │
    ┌─────┼─────┐
    ↓     ↓     ↓
   dir   dns   vhost
    │     │     │
    ↓     ↓     ↓
 Paths  Hosts  Sites
    │     │     │
    └─────┼─────┘
          ↓
   Further Enumeration
```

For example, begin with a directory scan:

```bash
gobuster dir \
  -u "http://TARGET" \
  -w /usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt
```

If appropriate, add extensions:

```bash
gobuster dir \
  -u "http://TARGET" \
  -w /usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt \
  -x php,txt,html
```

To preserve the results:

```bash
gobuster dir \
  -u "http://TARGET" \
  -w /usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt \
  -o gobuster.txt
```

---

## 16. Complete Command Reference

### Basic directory scan

```bash
gobuster dir \
  -u "http://TARGET" \
  -w WORDLIST
```

### Directory scan with extensions

```bash
gobuster dir \
  -u "http://TARGET" \
  -w WORDLIST \
  -x php,txt,html
```

### Follow redirects

```bash
gobuster dir \
  -u "http://TARGET" \
  -w WORDLIST \
  -r
```

### Save output

```bash
gobuster dir \
  -u "http://TARGET" \
  -w WORDLIST \
  -o results.txt
```

### DNS enumeration

```bash
gobuster dns \
  -d example.thm \
  -w WORDLIST
```

### Virtual host enumeration

```bash
gobuster vhost \
  -u "http://example.thm" \
  -w WORDLIST
```

---

## 17. Flag Cheat Sheet

| Flag | Function |
|---|---|
| `dir` | Directory/file enumeration |
| `dns` | DNS/subdomain enumeration |
| `vhost` | Virtual host enumeration |
| `-u` | Target URL |
| `-d` | Target domain |
| `-w` | Wordlist |
| `-x` | File extensions |
| `-t` | Threads |
| `-o` | Output file |
| `-r` | Follow redirects |
| `-k` | Skip TLS validation |
| `-s` | Status-code filtering |
| `--delay` | Delay between requests |

---

## 18. Common Errors to Avoid

### Choosing the wrong mode

If the objective is finding:

```text
/admin
/uploads
/backup
```

the appropriate mode is:

```text
dir
```

For subdomains, use:

```text
dns
```

For multiple websites hosted on the same IP, use:

```text
vhost
```

---

### Treating DNS and Vhost as identical

Remember:

```text
DNS
 ↓
Subdomain resolution

VHOST
 ↓
HTTP Host header
```

They may produce similar-looking hostnames, but the discovery mechanism is different.

---

### Using an unsuitable wordlist

A poor wordlist can cause interesting resources to be missed. Select a wordlist appropriate to the target and the size/depth of the scan.

---

### Looking only for `200`

A successful enumeration review should consider:

```text
200
301
302
403
```

depending on the application.

A redirect or forbidden response can still reveal useful information.

---

### Ignoring redirects

For example:

```text
/admin → 302 → /login
```

is still a useful discovery. The redirect itself provides information about the application's structure.

---

## 19. Revision Checklist

```text
[ ] Identify target IP/domain
[ ] Check robots.txt
[ ] Check sitemap.xml
[ ] Inspect HTTP headers
[ ] Identify technologies
[ ] Choose suitable wordlist
[ ] Run Gobuster dir
[ ] Test relevant extensions
[ ] Review 200 responses
[ ] Review redirects
[ ] Investigate 403 responses
[ ] Run DNS enumeration
[ ] Identify subdomains
[ ] Run vhost enumeration
[ ] Investigate interesting hosts
[ ] Save scan results
```

---

## 20. Three Modes — One Final Picture

```text
Gobuster
   ↓
Enumeration Tool
   │
   ├── dir
   │    ↓
   │  Directories + Files
   │
   ├── dns
   │    ↓
   │  Subdomains
   │
   └── vhost
        ↓
      Virtual Hosts
```

The complete reconnaissance concept can be remembered like this:

```text
                 RECON
                   │
                   ↓
            Content Discovery
                   │
        ┌──────────┼──────────┐
        ↓          ↓          ↓
      Manual     Gobuster    OSINT
        │          │
        │     ┌────┼────┐
        │     ↓    ↓    ↓
        │    dir  dns  vhost
        │     │    │     │
        │     ↓    ↓     ↓
        │   Paths Hosts Websites
        │     │    │     │
        └─────┴────┴─────┘
                   ↓
          Attack Surface Map
                   ↓
          Further Investigation
```

---

## Final Takeaways

- Gobuster is primarily an **enumeration and reconnaissance tool**.
- `dir` discovers **directories and files**.
- `dns` discovers **subdomains**.
- `vhost` discovers **virtual hosts**.
- Wordlists supply the candidate names that Gobuster tests.
- HTTP status codes are essential when interpreting scan results.
- `200` is useful, but `301`, `302`, and `403` can also provide valuable information.
- `-x` adds file-extension testing.
- `-o` saves results for later analysis.
- `-t` controls concurrent threads.
- Subdomains are resolved through **DNS**, while virtual hosts are selected by the HTTP **`Host` header**.
- Effective enumeration is systematic: select the correct mode, use an appropriate wordlist, understand the responses, and investigate the results.

> **Core skill:** Don't treat Gobuster as simply a command that searches for `200` responses. The real skill is knowing **what you're trying to enumerate, selecting the appropriate mode and wordlist, and correctly interpreting what the target returns**.
