# Gobuster

## কী?

`Gobuster` একটি enumeration tool, যা এই section-এ মূলত দুই ধরনের কাজে ব্যবহার করা হয়েছে:

- **Directory/File Enumeration**
- **DNS Subdomain Enumeration**

Source অনুযায়ী Gobuster-এর আরও functionality আছে, যেমন vhost এবং public AWS S3 bucket enumeration; তবে এই section-এর focus `dir` এবং `dns` mode।

---

## Directory/File Enumeration

### Command

```bash
gobuster dir -u http://10.10.10.121/ -w /usr/share/seclists/Discovery/Web-Content/common.txt
```

### Command Breakdown

| Part | কাজ |
|---|---|
| `gobuster` | Tool |
| `dir` | Directory/file enumeration mode |
| `-u` | Target URL |
| `http://10.10.10.121/` | Target |
| `-w` | Wordlist |
| `common.txt` | Path names-এর wordlist |

Gobuster wordlist-এর entries ব্যবহার করে বিভিন্ন path request করে। Response status দেখে interesting resource identify করা যায়।

### Example Result

```text
/index.php     (Status: 200)
/server-status (Status: 403)
/wordpress     (Status: 301)
```

`/wordpress` একটি redirect response (`301`) দিয়ে পাওয়া গেছে। Source অনুযায়ী browser-এ এটি WordPress setup mode-এ ছিল।

---

## DNS Enumeration

### Command

```bash
gobuster dns -d inlanefreight.com -w /usr/share/SecLists/Discovery/DNS/namelist.txt
```

### Breakdown

| Part | কাজ |
|---|---|
| `dns` | DNS enumeration mode |
| `-d` | Target domain |
| `inlanefreight.com` | Domain |
| `-w` | Wordlist |
| `namelist.txt` | Subdomain names-এর wordlist |

Example results:

```text
blog.inlanefreight.com
customer.inlanefreight.com
my.inlanefreight.com
```

এই subdomain-গুলো পরে আলাদাভাবে examine করা যায়।

---

## মনে রাখার সহজ নিয়ম

```text
dir  → directories/files
dns  → subdomains
-u   → URL
-d   → domain
-w   → wordlist
```

> এই notes-এর commands authorized lab/CTF/assessment environment-এ ব্যবহার করার জন্য।
