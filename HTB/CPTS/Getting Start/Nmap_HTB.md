# Nmap Quick README — HTB

> **Goal:** Nmap-এর দরকারি command এক নজরে দেখা। Theory কম, command + কাজ + কখন ব্যবহার করবে বেশি।

---

## 0. Basic Formula

```bash
nmap [options] <target>
```

Example:

```bash
nmap 10.129.42.253
```

**Target** হতে পারে:

```text
10.129.42.253
10.10.10.0/24
```

---

# 1. Basic Scan ⭐

```bash
nmap 10.129.42.253
```

### কী করে?
Defaultভাবে target-এর **top 1,000 common TCP ports** scan করে।

### দ্রুত কী জানতে পারবে?
- কোন port open
- কোন service সাধারণভাবে associated
- TCP port

### Example output

```text
PORT    STATE SERVICE
21/tcp  open  ftp
22/tcp  open  ssh
80/tcp  open  http
139/tcp open  netbios-ssn
445/tcp open  microsoft-ds
```

### প্রথমে এটা চালাও

```bash
nmap <TARGET>
```

---

# 2. Full Port Scan ⭐⭐⭐

```bash
nmap -p- <TARGET>
```

### কী করে?
**সব 65,535 TCP ports** scan করে।

### কখন ব্যবহার করবে?
Basic scan-এর পরে। কারণ important service কখনো common 1,000 ports-এর বাইরে থাকতে পারে।

### Example

```bash
nmap -p- 10.129.42.253
```

---

# 3. Service Version Detection ⭐⭐⭐

```bash
nmap -sV <TARGET>
```

### কী করে?
Open port-এ কোন **service/application** চলছে এবং তার **version** বের করার চেষ্টা করে।

### Example

```bash
nmap -sV 10.129.42.253
```

### Output idea

```text
21/tcp  open  ftp    vsftpd 3.0.3
22/tcp  open  ssh    OpenSSH 8.2p1
80/tcp  open  http   Apache httpd 2.4.41
```

### কেন দরকার?
Version জানলে পরে ওই version-এর known vulnerability/misconfiguration check করা সহজ হয়।

---

# 4. Default Nmap Scripts ⭐⭐⭐

```bash
nmap -sC <TARGET>
```

### কী করে?
Nmap-এর **default scripts** চালায় এবং extra information বের করার চেষ্টা করে।

### কী ধরনের information আসতে পারে?
- Service details
- HTTP headers
- HTTP title
- SMB information
- FTP anonymous login
- অন্যান্য useful enumeration

### Example

```bash
nmap -sC 10.129.42.253
```

---

# 5. Most Useful Full Scan ⭐⭐⭐⭐⭐

```bash
nmap -sV -sC -p- <TARGET>
```

### তিনটা option

| Option | কাজ |
|---|---|
| `-sV` | Service + Version detection |
| `-sC` | Default Nmap scripts |
| `-p-` | সব 65,535 TCP ports |

### HTB-তে খুব useful

```bash
nmap -sV -sC -p- 10.129.42.253
```

### মনে রাখো

```text
-sV  → Version
-sC  → Scripts
-p-  → All ports
```

---

# 6. Specific Port Scan

```bash
nmap -p <PORT> <TARGET>
```

### Example

```bash
nmap -p21 10.129.42.253
```

একাধিক port:

```bash
nmap -p21,22,80,445 10.129.42.253
```

### Range

```bash
nmap -p1-1000 10.129.42.253
```

### কখন?
যখন already জানা আছে কোন port check করতে হবে।

---

# 7. FTP Enumeration

FTP সাধারণত **port 21**-এ থাকে।

```bash
nmap -sC -sV -p21 <TARGET>
```

### কী দেখবে?

বিশেষ করে:

```text
Anonymous FTP login allowed
```

এটা থাকলে FTP-তে anonymous access আছে কিনা further check করা যায়।

### Example

```bash
nmap -sC -sV -p21 10.129.42.253
```

---

# 8. Banner Grabbing with Nmap ⭐⭐

```bash
nmap -sV --script=banner <TARGET>
```

### কী করে?
Service-এর **banner** বের করার চেষ্টা করে।

### Example

```bash
nmap -sV --script=banner 10.129.42.253
```

Possible result:

```text
220 (vsFTPd 3.0.3)
```

এখান থেকে service version পাওয়া যেতে পারে।

---

# 9. Banner Grab on Specific Port

```bash
nmap -sV --script=banner -p21 <TARGET>
```

### Example

```bash
nmap -sV --script=banner -p21 10.129.42.253
```

### Multiple hosts

```bash
nmap -sV --script=banner -p21 10.10.10.0/24
```

---

# 10. Run a Specific Nmap Script ⭐⭐⭐

### General syntax

```bash
nmap --script <SCRIPT_NAME> -p<PORT> <TARGET>
```

### Example

```bash
nmap --script smb-os-discovery.nse -p445 10.10.10.40
```

### এখানে

```text
--script            → কোন Nmap script চালাবে
smb-os-discovery.nse → script name
-p445               → port 445
10.10.10.40         → target
```

---

# 11. SMB OS Discovery ⭐⭐⭐

SMB সাধারণত **port 445**-এ থাকে।

```bash
nmap --script smb-os-discovery.nse -p445 <TARGET>
```

### Example

```bash
nmap --script smb-os-discovery.nse -p445 10.10.10.40
```

### কী বের হতে পারে?

```text
OS
Computer name
NetBIOS name
Workgroup
System time
```

### Example result

```text
OS: Windows 7 Professional
Computer name: CEO-PC
NetBIOS computer name: CEO-PC
Workgroup: WORKGROUP
```

---

# 12. Aggressive Scan ⭐⭐⭐

```bash
nmap -A <TARGET>
```

`-A` অনেক বেশি information gathering enable করে।

Source-এর example:

```bash
nmap -A -p445 10.129.42.253
```

### কী ধরনের information পেতে পারো?
- OS detection
- Service/version detection
- Nmap scripts
- Traceroute-related information

### মনে রাখো

```text
-A → Aggressive / more information
```

> `-A` scan সাধারণত basic scan-এর চেয়ে বেশি সময় নিতে পারে এবং বেশি traffic generate করতে পারে।

---

# 13. OS Detection

Source-এর examples-এ OS information `-sV`, scripts এবং `-A` output-এর মাধ্যমে পাওয়া হয়েছে।

Useful command:

```bash
nmap -A <TARGET>
```

Specific service-এর ক্ষেত্রে:

```bash
nmap -A -p445 <TARGET>
```

### Output-এ খুঁজবে

```text
OS guesses
OS details
Linux
Windows
```

> OS detection সবসময় 100% accurate নাও হতে পারে।

---

# 14. Find Available Nmap Scripts

Linux-এ:

```bash
locate scripts/citrix
```

এটা Nmap scan command না; available Nmap scripts খুঁজতে ব্যবহার করা হয়েছে।

Example output:

```text
/usr/share/nmap/scripts/citrix-brute-xml.nse
/usr/share/nmap/scripts/citrix-enum-apps-xml.nse
/usr/share/nmap/scripts/citrix-enum-apps.nse
/usr/share/nmap/scripts/citrix-enum-servers-xml.nse
/usr/share/nmap/scripts/citrix-enum-servers.nse
```

---

# 15. Nmap Script Cheat Sheet

### Default scripts

```bash
nmap -sC <TARGET>
```

### Specific script

```bash
nmap --script <SCRIPT_NAME> -p<PORT> <TARGET>
```

### Banner script

```bash
nmap -sV --script=banner <TARGET>
```

### SMB OS discovery

```bash
nmap --script smb-os-discovery.nse -p445 <TARGET>
```

---

# 16. PORT / STATE / SERVICE বুঝবে যেভাবে

Example:

```text
PORT    STATE SERVICE
21/tcp  open  ftp
22/tcp  open  ssh
80/tcp  open  http
```

| Field | Meaning |
|---|---|
| `PORT` | Port number + protocol |
| `STATE` | Port-এর current state |
| `SERVICE` | সাধারণভাবে associated service |

### Common states

```text
open
filtered
closed
```

### `filtered`
Firewall/network filtering-এর কারণে Nmap নিশ্চিতভাবে বলতে পারছে না port accessible কিনা।

---

# 17. Port → Common Service Quick Look

| Port | Common Service |
|---:|---|
| `21` | FTP |
| `22` | SSH |
| `80` | HTTP |
| `139` | NetBIOS/SMB |
| `445` | SMB |
| `3389` | RDP |

> এগুলো common/default associations। Actual service verify করতে `-sV` ব্যবহার করো।

---

# 18. HTB Nmap Workflow ⭐⭐⭐⭐⭐

## Step 1 — Basic

```bash
nmap <TARGET>
```

↓

## Step 2 — Full ports

```bash
nmap -p- <TARGET>
```

↓

## Step 3 — Service + Version

```bash
nmap -sV -p- <TARGET>
```

↓

## Step 4 — Default scripts

```bash
nmap -sC -sV -p- <TARGET>
```

↓

## Step 5 — Interesting port পেলে targeted scan

Example:

```bash
nmap -sC -sV -p21 <TARGET>
```

SMB:

```bash
nmap --script smb-os-discovery.nse -p445 <TARGET>
```

Banner:

```bash
nmap -sV --script=banner -p21 <TARGET>
```

---

# 19. One-Page Cheat Sheet 🔥

```bash
# Basic scan
nmap <TARGET>

# All TCP ports
nmap -p- <TARGET>

# Service/version detection
nmap -sV <TARGET>

# Default scripts
nmap -sC <TARGET>

# Full useful scan
nmap -sC -sV -p- <TARGET>

# Specific port
nmap -p21 <TARGET>

# Multiple ports
nmap -p21,22,80,445 <TARGET>

# Port range
nmap -p1-1000 <TARGET>

# Banner grabbing
nmap -sV --script=banner <TARGET>

# Banner on specific port
nmap -sV --script=banner -p21 <TARGET>

# Specific Nmap script
nmap --script <SCRIPT_NAME> -p<PORT> <TARGET>

# SMB OS discovery
nmap --script smb-os-discovery.nse -p445 <TARGET>

# Aggressive scan
nmap -A <TARGET>

# Aggressive scan on specific port
nmap -A -p445 <TARGET>
```

---

# 20. কোনটা কখন চালাবে?

| Situation | Command |
|---|---|
| Target alive / basic ports দেখতে | `nmap <TARGET>` |
| সব TCP port দেখতে | `nmap -p- <TARGET>` |
| Service version জানতে | `nmap -sV <TARGET>` |
| Default enumeration করতে | `nmap -sC <TARGET>` |
| Full HTB scan | `nmap -sC -sV -p- <TARGET>` |
| Specific port check | `nmap -p<PORT> <TARGET>` |
| Banner দেখতে | `nmap -sV --script=banner <TARGET>` |
| Specific script চালাতে | `nmap --script <SCRIPT> -p<PORT> <TARGET>` |
| SMB OS জানতে | `nmap --script smb-os-discovery.nse -p445 <TARGET>` |
| বেশি information একসাথে | `nmap -A <TARGET>` |

---

# 21. সবচেয়ে বেশি মনে রাখার 6টা

```bash
nmap <TARGET>
```

```bash
nmap -p- <TARGET>
```

```bash
nmap -sV <TARGET>
```

```bash
nmap -sC <TARGET>
```

```bash
nmap -sC -sV -p- <TARGET>
```

```bash
nmap --script <SCRIPT> -p<PORT> <TARGET>
```

### Shortcut memory

```text
-p-  = All ports
-sV  = Version
-sC  = Default scripts
-A   = Aggressive / more info
-p   = Specific port
--script = Specific script
```

---

## HTB-তে প্রথমে যে commandটা মাথায় রাখবে

```bash
nmap -sC -sV -p- <TARGET>
```

তারপর output দেখে **interesting ports/services** অনুযায়ী targeted Nmap scan চালাবে।
