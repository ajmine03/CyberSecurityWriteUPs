# HTB Service Enumeration — Practical README

> **Focus:** HTB-তে target scan করার পর কোন command কখন চালাতে হবে।
> Theory কম; command → purpose → next step.

---

# 1. Target-এর প্রথম Scan ⭐⭐⭐⭐⭐

## Basic service/version scan

```bash
nmap -sV <TARGET>
```

### কখন?
Target IP পাওয়ার পর **প্রথমে** এটা চালাও।

### Example

```bash
nmap -sV 10.129.129.100
```

### কী পাবে?

```text
21/tcp    open  ftp
22/tcp    open  ssh
80/tcp    open  http
139/tcp   open  netbios-ssn
445/tcp   open  netbios-ssn
2323/tcp  open  telnet
8080/tcp  open  http
```

### এই target-এর গুরুত্বপূর্ণ services

| Port | Service | প্রথমে কী করবে |
|---:|---|---|
| 21 | FTP | Anonymous login check |
| 22 | SSH | Credentials পেলে SSH |
| 80 | HTTP | Browser/web enumeration |
| 139 | SMB/NetBIOS | SMB enumeration |
| 445 | SMB | Share enumeration |
| 2323 | Telnet | Login/service check |
| 8080 | HTTP/Tomcat | Web/Tomcat enumeration |

Source-এর scan-এ এই services পাওয়া গেছে। fileciteturn3file0L2-L15

---

# 2. Full Port Scan ⭐⭐⭐⭐

যদি initial scan-এর পরে আরও ports খুঁজতে চাও:

```bash
nmap -p- <TARGET>
```

আর service/version সহ:

```bash
nmap -p- -sV <TARGET>
```

### কখন?
যখন নিশ্চিত হতে চাও যে common ports-এর বাইরে আর কোনো service আছে কিনা।

---

# 3. Default Nmap Scripts ⭐⭐⭐⭐

```bash
nmap -sC -sV <TARGET>
```

Full scan-এর সাথে:

```bash
nmap -sC -sV -p- <TARGET>
```

### কখন?
Initial scan-এর পরে service সম্পর্কে আরও information দরকার হলে।

---

# 4. SMB Enumeration ⭐⭐⭐⭐⭐

SMB সাধারণত:

```text
139
445
```

## SMB OS discovery

```bash
nmap --script smb-os-discovery.nse -p445 <TARGET>
```

### কখন?
Port `445` open দেখলে।

Example:

```bash
nmap --script smb-os-discovery.nse -p445 10.129.129.100
```

Source-এ `445`-এ Samba এবং SMB information পাওয়া গেছে। fileciteturn3file0L121-L150

---

# 5. SMB-এর সব Share List করা ⭐⭐⭐⭐⭐

```bash
smbclient -L //<TARGET> -N
```

Example:

```bash
smbclient -L //10.129.129.100 -N
```

### `-L`
Available SMB shares list করে।

### `-N`
Password prompt না দিয়ে anonymous/unauthenticated attempt করে।

### Example result

```text
Sharename       Type
---------       ----
print$          Disk
users           Disk
IPC$            IPC
```

এই target-এ `users` share পাওয়া গেছে। fileciteturn3file0L275-L285

---

# 6. Specific SMB Share-এ Connect ⭐⭐⭐⭐⭐

## Username দিয়ে

```bash
smbclient -U <USERNAME> //<TARGET>/<SHARE>
```

Example:

```bash
smbclient -U bob //10.129.129.100/users
```

তারপর password দাও।

### কখন?
Share list থেকে interesting share পাওয়ার পরে এবং valid credentials থাকলে।

---

# 7. SMB Share-এর ভিতরে ⭐⭐⭐⭐⭐

Connect হওয়ার পরে prompt:

```text
smb: \>
```

### Current directory

```text
pwd
```

### Files/folders list

```text
ls
```

অথবা:

```text
dir
```

### Folder-এ ঢোকা

```text
cd <folder>
```

Example:

```text
cd flag
```

### Parent directory

```text
cd ..
```

---

# 8. SMB থেকে File Download ⭐⭐⭐⭐⭐

```text
get <filename>
```

Example:

```text
get flag.txt
```

### কখন?
`ls` দিয়ে interesting file পাওয়ার পরে।

### Important

`smbclient`-এর ভিতরে:

```text
cat flag.txt
```

কাজ করবে না।

`cat` হলো Linux shell command।

SMB file download করতে:

```text
get flag.txt
```

তারপর SMB থেকে বের হও:

```text
exit
```

Linux shell-এ:

```bash
cat flag.txt
```

এই workflow-তেই target-এর `flag.txt` download করা হয়েছিল। fileciteturn3file0L287-L320

---

# 9. SMB Quick Workflow 🔥

```bash
# 1. Shares list
smbclient -L //<TARGET> -N

# 2. Connect
smbclient -U <USER> //<TARGET>/<SHARE>

# 3. Inside SMB
ls

# 4. Enter folder
cd <folder>

# 5. List files
ls

# 6. Download
get <file>

# 7. Exit SMB
exit

# 8. Read downloaded file
cat <file>
```

### HTB Example

```bash
smbclient -L //10.129.129.100 -N
```

```bash
smbclient -U bob //10.129.129.100/users
```

Inside:

```text
ls
cd flag
ls
get flag.txt
exit
```

Then:

```bash
cat flag.txt
```

---

# 10. SMB Permission Error বুঝবে যেভাবে

যদি দেখো:

```text
NT_STATUS_ACCESS_DENIED
```

তাহলে ওই user-এর permission নেই।

Example:

```text
smb: \> ls
NT_STATUS_ACCESS_DENIED listing \*
```

অথবা:

```text
smb: \> cd a
NT_STATUS_ACCESS_DENIED
```

### তখন কী করবে?

Random command repeat না করে:

1. অন্য valid credentials আছে কিনা দেখো
2. অন্য share আছে কিনা দেখো
3. সঠিক user দিয়ে reconnect করো

Example:

```bash
smbclient -U bob //10.129.129.100/users
```

---

# 11. `su` SMB-এর ভিতরে ব্যবহার করবে না ❌

যদি prompt হয়:

```text
smb: \>
```

তখন:

```text
su
```

দিলে কাজ করবে না।

কারণ তুমি Linux shell-এ নেই।

SMB থেকে বের হও:

```text
exit
```

তারপর Linux terminal-এ প্রয়োজনীয় command চালাও।

---

# 12. `cat` SMB-এর ভিতরে নয় ❌

Wrong:

```text
smb: \> cat flag.txt
```

Result:

```text
cat: command not found
```

Correct:

```text
smb: \> get flag.txt
smb: \> exit
```

তারপর Linux terminal:

```bash
cat flag.txt
```

---

# 13. FTP Enumeration ⭐⭐⭐⭐⭐

FTP সাধারণত:

```text
21/tcp
```

## Nmap

```bash
nmap -sC -sV -p21 <TARGET>
```

### কখন?
Port `21` open দেখলে।

---

# 14. FTP Connect

```bash
ftp -p <TARGET>
```

Example:

```bash
ftp -p 10.129.129.100
```

যদি anonymous FTP enabled থাকে:

```text
Name: anonymous
```

Password চাইলে target/lab অনুযায়ী prompt follow করো।

Source-এ `anonymous` login successful হয়েছিল। fileciteturn3file0L67-L73

---

# 15. FTP-এর ভিতরের দরকারি Commands

```text
ls
```

Files/folders দেখাবে।

```text
cd <folder>
```

Folder-এ ঢুকবে।

Example:

```text
cd pub
```

```text
get <file>
```

File download করবে।

Example:

```text
get login.txt
```

```text
exit
```

FTP থেকে বের হবে।

---

# 16. FTP File Read করার Correct Way ⭐⭐⭐

FTP-এর ভিতরে:

```text
ftp> get login.txt
ftp> exit
```

তারপর Linux terminal:

```bash
cat login.txt
```

### ভুল

```text
ftp> cat login.txt
```

`ftp` client-এর মধ্যে `cat` সাধারণ Linux command হিসেবে কাজ করে না।

Source-এ `cat login.txt` দিলে invalid command দেখিয়েছে, পরে `get login.txt` দিয়ে file download করা হয়েছে। fileciteturn3file0L81-L117

---

# 17. FTP Quick Workflow 🔥

```bash
# 1. Scan
nmap -sC -sV -p21 <TARGET>

# 2. Connect
ftp -p <TARGET>

# 3. Try anonymous
anonymous

# 4. List
ls

# 5. Enter interesting folder
cd pub

# 6. Download
get login.txt

# 7. Exit
exit

# 8. Read locally
cat login.txt
```

---

# 18. FTP থেকে Credentials পেলে

Example:

```text
admin:ftp@dmin123
```

Credentials পেলে অন্য services-এ reuse আছে কিনা **HTB target-এর scope-এর মধ্যে** check করতে পারো।

Possible next checks:

```bash
ssh admin@<TARGET>
```

অথবা SMB:

```bash
smbclient -U admin //<TARGET>/<SHARE>
```

---

# 19. HTTP — Port 80 ⭐⭐⭐

যদি:

```text
80/tcp open http
```

দেখো, browser-এ:

```text
http://<TARGET>
```

খুলো।

Example:

```text
http://10.129.129.100
```

### কখন?
Nmap-এ `80` open হলে।

---

# 20. HTTP — Port 8080 ⭐⭐⭐⭐

যদি:

```text
8080/tcp open http
```

দেখো:

```text
http://<TARGET>:8080
```

Example:

```text
http://10.129.129.100:8080
```

Source-এর scan-এ `8080`-এ Apache Tomcat পাওয়া গেছে। fileciteturn3file0L8-L15

---

# 21. Telnet — Port 2323 ⭐⭐⭐

যদি:

```text
2323/tcp open telnet
```

দেখো, service manually connect করে inspect করতে পারো:

```bash
telnet <TARGET> 2323
```

Example:

```bash
telnet 10.129.129.100 2323
```

### কখন?
Nmap-এ `2323/tcp` Telnet হিসেবে identify হলে।

---

# 22. SSH — Port 22 ⭐⭐⭐

যদি valid credentials পাও:

```bash
ssh <USER>@<TARGET>
```

Example:

```bash
ssh admin@10.129.129.100
```

### কখন?
- Port 22 open
- Valid username/password বা অন্য valid SSH authentication পাওয়া গেছে

---

# 23. Nmap `-A` — More Information ⭐⭐⭐

```bash
nmap -A -p445 <TARGET>
```

### কখন?
কোনো specific service সম্পর্কে বেশি information দরকার হলে।

Example:

```bash
nmap -A -p445 10.129.129.100
```

Source-এ SMB-এর জন্য এটি Samba version, NetBIOS name এবং SMB security information দিয়েছে। fileciteturn3file0L131-L150

---

# 24. Common Mistakes থেকে শেখা ⭐⭐⭐⭐⭐

## ভুল 1 — `-u`

Wrong:

```bash
smbclient -u ajm ...
```

Correct:

```bash
smbclient -U ajm ...
```

`-U` = username।

---

## ভুল 2 — SMB path ভুল

Correct format:

```bash
smbclient -U bob //10.129.129.100/users
```

---

## ভুল 3 — SMB-এর ভিতরে `cat`

Wrong:

```text
smb: \> cat flag.txt
```

Correct:

```text
smb: \> get flag.txt
smb: \> exit
```

তারপর:

```bash
cat flag.txt
```

---

## ভুল 4 — FTP-এর ভিতরে `cat`

Wrong:

```text
ftp> cat login.txt
```

Correct:

```text
ftp> get login.txt
ftp> exit
```

তারপর:

```bash
cat login.txt
```

---

## ভুল 5 — SMB-এর ভিতরে `su`

Wrong:

```text
smb: \> su
```

কারণ এটা Linux shell না।

Correct:

```text
smb: \> exit
```

তারপর Linux shell-এ `su` দরকার হলে ব্যবহার করবে।

---

# 25. Full HTB Decision Flow ⭐⭐⭐⭐⭐

```text
TARGET IP
   │
   ▼
nmap -sV <TARGET>
   │
   ├── 21 FTP ───────► FTP enumeration
   │                     │
   │                     └─ anonymous?
   │                          │
   │                          └─ ls → cd → get
   │
   ├── 22 SSH ───────► credentials পেলে SSH
   │
   ├── 80 HTTP ──────► Browser / web enumeration
   │
   ├── 139 SMB ──────► SMB enumeration
   │
   ├── 445 SMB ──────► SMB shares
   │                     │
   │                     └─ smbclient -L
   │                          │
   │                          └─ connect as valid user
   │                               │
   │                               └─ ls → cd → get
   │
   ├── 2323 Telnet ──► Telnet connection
   │
   └── 8080 HTTP ────► Browser / Tomcat enumeration
```

---

# 26. MASTER CHEAT SHEET 🔥🔥🔥

## Nmap

```bash
nmap -sV <TARGET>
```

```bash
nmap -p- -sV <TARGET>
```

```bash
nmap -sC -sV -p- <TARGET>
```

```bash
nmap -A -p<PORT> <TARGET>
```

```bash
nmap --script smb-os-discovery.nse -p445 <TARGET>
```

---

## SMB

```bash
smbclient -L //<TARGET> -N
```

```bash
smbclient -U <USER> //<TARGET>/<SHARE>
```

Inside:

```text
ls
pwd
cd <folder>
get <file>
exit
```

Then:

```bash
cat <file>
```

---

## FTP

```bash
nmap -sC -sV -p21 <TARGET>
```

```bash
ftp -p <TARGET>
```

Inside:

```text
ls
cd <folder>
get <file>
exit
```

Then:

```bash
cat <file>
```

---

## SSH

```bash
ssh <USER>@<TARGET>
```

---

## Telnet

```bash
telnet <TARGET> 2323
```

---

## HTTP

```text
http://<TARGET>
```

## HTTP 8080

```text
http://<TARGET>:8080
```

---

# 27. কোনটা কখন? — একদম Short Version

| Situation | Command |
|---|---|
| Target-এর services জানতে | `nmap -sV <TARGET>` |
| সব TCP port খুঁজতে | `nmap -p- -sV <TARGET>` |
| বেশি enumeration | `nmap -sC -sV -p- <TARGET>` |
| SMB 445 দেখলে | `nmap --script smb-os-discovery.nse -p445 <TARGET>` |
| SMB shares দেখতে | `smbclient -L //<TARGET> -N` |
| SMB-তে username দিয়ে ঢুকতে | `smbclient -U <USER> //<TARGET>/<SHARE>` |
| SMB folder দেখতে | `ls` |
| SMB folder-এ ঢুকতে | `cd <folder>` |
| SMB file নামাতে | `get <file>` |
| FTP 21 দেখলে | `ftp -p <TARGET>` |
| FTP file নামাতে | `get <file>` |
| Downloaded file পড়তে | `cat <file>` |
| SSH credentials পেলে | `ssh <USER>@<TARGET>` |
| Telnet 2323 দেখলে | `telnet <TARGET> 2323` |
| HTTP 80 দেখলে | `http://<TARGET>` |
| HTTP 8080 দেখলে | `http://<TARGET>:8080` |

---

# 28. Golden Rule 🧠

### Nmap

```text
SCAN → FIND PORT → IDENTIFY SERVICE → ENUMERATE SERVICE
```

### SMB

```text
LIST SHARES
    ↓
CONNECT WITH VALID USER
    ↓
ls
    ↓
cd
    ↓
get
    ↓
exit
    ↓
cat
```

### FTP

```text
CONNECT
    ↓
anonymous?
    ↓
ls
    ↓
cd
    ↓
get
    ↓
exit
    ↓
cat
```

> **Remember:** `smbclient`/`ftp`-এর ভিতরের commands আর Linux terminal commands এক না।
