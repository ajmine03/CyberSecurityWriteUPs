# Metasploit: Introduction

Room Name: Metasploit: Introduction
Platform: TryHackMe

---

## 1. Metasploit কী?

Metasploit হলো একটি penetration testing framework।

এটি ব্যবহার করে:

* Vulnerability খোঁজা
* Scanning
* Exploitation
* Payload ব্যবহার
* Post-exploitation

করা যায়।

এই room-এ মূলত Metasploit Framework এবং `msfconsole` শেখানো হবে।

---

## 2. `msfconsole`

Metasploit চালু করার প্রধান command:

```bash
msfconsole
```

চালু হলে সাধারণত:

```text
msf6 >
```

দেখাবে।

`msfconsole` হলো Metasploit-এর main interface।

---

## 3. তিনটি গুরুত্বপূর্ণ Concept

### Vulnerability

Target system-এর কোনো weakness বা flaw।

```text
Vulnerability = দুর্বলতা
```

---

### Exploit

Vulnerability-কে ব্যবহার করার code বা technique।

```text
Exploit = দুর্বলতাকে কাজে লাগানোর উপায়
```

---

### Payload

Exploit সফল হওয়ার পরে target system-এ যে code/action চালানো হয়।

```text
Payload = Exploit-এর পরে কী কাজ হবে
```

সহজভাবে:

```text
Vulnerability
      ↓
   Exploit
      ↓
   Payload
```

---

# 4. Important Module Types

## Auxiliary

Supporting modules।

যেমন:

* Scanner
* Crawler
* Fuzzer
* Information gathering

```text
Auxiliary = Supporting work
```

---

## Exploit

কোনো vulnerability exploit করার module।

```text
Exploit = Vulnerability কাজে লাগায়
```

---

## Payload

Target system-এ execute হওয়া code।

যেমন:

* Shell পাওয়া
* Command চালানো
* অন্য কোনো action করা

---

## Encoder

Exploit বা payload encode করতে ব্যবহার করা হয়।

এগুলো signature-based antivirus detection এড়াতে কিছু ক্ষেত্রে সাহায্য করতে পারে, তবে এটি guaranteed antivirus bypass নয়।

---

## Evasion

Security/antivirus detection এড়ানোর উদ্দেশ্যে তৈরি modules।

```text
Encoder → Encode করে
Evasion → Detection এড়ানোর চেষ্টা করে
```

---

## NOP

NOP = No Operation

CPU-কে কিছু না করার instruction।

Exploit development-এ buffer/padding হিসেবে ব্যবহার হতে পারে।

---

## Post

Exploitation সফল হওয়ার পরে ব্যবহার করা modules।

```text
Exploit
   ↓
Access
   ↓
Post-exploitation
```

---

# 5. Payload Types

Payload-এর মধ্যে কয়েকটি important category আছে।

## Singles

Self-contained payload।

অতিরিক্ত component download করার প্রয়োজন হয় না।

```text
Single = Complete payload
```

---

## Stager

Target এবং Metasploit-এর মধ্যে connection তৈরি করে এবং পরে বড় payload আনার ব্যবস্থা করে।

```text
Stager → Connection তৈরি করে
```

---

## Stage

Stager-এর মাধ্যমে পরে যে বড় payload/component আসে।

```text
Stager
   ↓
Stage
```

---

## Adapters

একটি payload-কে অন্য format-এর মধ্যে wrap করতে সাহায্য করে।

---

# 6. Single vs Staged Payload

Metasploit-এর naming দেখে এগুলো চিনতে পারা যায়।

### Single

```text
generic/shell_reverse_tcp
```

এখানে:

```text
shell_reverse_tcp
     _
```

`_` থাকলে এটি সাধারণত Single/Inline payload।

---

### Staged

```text
windows/x64/shell/reverse_tcp
```

এখানে:

```text
shell/reverse_tcp
     /
```

`/` থাকলে এটি সাধারণত Staged payload।

মনে রাখো:

```text
_ = Single
/ = Staged
```

---

# 7. Metasploit Prompts

Prompt দেখে বুঝতে হবে তুমি কোথায় আছো।

### Linux Prompt

```text
root@machine:~#
```

এটা normal Linux terminal।

---

### Main Metasploit Prompt

```text
msf6 >
```

এখানে এখনো কোনো module context select করা হয়নি।

---

### Module Context

```text
msf6 exploit(windows/smb/...) >
```

তুমি এখন একটি specific module-এর ভিতরে আছো।

---

### Meterpreter

```text
meterpreter >
```

Target-এর সঙ্গে Meterpreter connection হয়েছে।

---

### Target Shell

```text
C:\Windows\system32>
```

এখানে command target machine-এ execute হবে।

---

# 8. Important Commands

## `help`

Command সম্পর্কে help দেখতে:

```bash
help
```

Specific command-এর help:

```bash
help set
```

---

## `history`

আগে যে commands দিয়েছ সেগুলো দেখতে:

```bash
history
```

---

## `search`

Relevant module খুঁজতে:

```bash
search <keyword>
```

Example:

```bash
search ms17-010
```

CVE, exploit name বা target system দিয়েও search করা যায়।

---

## `use`

কোনো module select করতে:

```bash
use <module>
```

Example:

```bash
use exploit/windows/smb/ms17_010_eternalblue
```

অথবা search result-এর number ব্যবহার করা যায়:

```bash
use 2
```

---

## `show options`

বর্তমান module-এর প্রয়োজনীয় options দেখতে:

```bash
show options
```

---

## `show payloads`

বর্তমান exploit-এর compatible payload দেখতে:

```bash
show payloads
```

---

## `info`

Module সম্পর্কে বিস্তারিত information দেখতে:

```bash
info
```

`info`-তে module-এর:

* Name
* Platform
* Rank
* Author
* Target
* Options
* Description

ইত্যাদি দেখা যায়।

---

## `set`

বর্তমান module-এর কোনো parameter set করতে:

```bash
set PARAMETER VALUE
```

Example:

```bash
set RHOSTS 10.10.x.x
```

---

## `setg`

Global value set করতে:

```bash
setg RHOSTS 10.10.x.x
```

Difference:

```text
set  = Current module
setg = Global
```

---

## `unset`

কোনো value remove করতে:

```bash
unset RHOSTS
```

সব current values clear করতে:

```bash
unset all
```

Global value remove করতে:

```bash
unsetg RHOSTS
```

---

## `back`

বর্তমান module context থেকে বের হতে:

```bash
back
```

Example:

```text
msf6 exploit(...) >
```

থেকে:

```text
msf6 >
```

---

## `run`

Module চালানোর জন্য:

```bash
run
```

---

## `exploit`

Exploit module চালাতে:

```bash
exploit
```

`run` এবং `exploit` অনেক ক্ষেত্রে একই কাজ করতে পারে।

---

# 9. Important Parameters

## RHOSTS

Target machine-এর IP address।

```text
RHOSTS = Target
```

---

## RPORT

Target-এর যে port-এ vulnerable service চলছে।

```text
RPORT = Target Port
```

---

## PAYLOAD

Exploit সফল হলে কোন payload ব্যবহার হবে।

```text
PAYLOAD = What runs on target
```

---

## LHOST

তোমার AttackBox/Kali machine-এর IP।

```text
LHOST = Attacker IP
```

---

## LPORT

Attacker machine-এর listening port।

```text
LPORT = Attacker Port
```

---

## SESSION

Target-এর সঙ্গে existing connection-এর ID।

Post-exploitation modules-এ এটি গুরুত্বপূর্ণ।

```text
SESSION = Existing connection ID
```

---

# 10. RHOSTS vs LHOST

এটা অবশ্যই মনে রাখবে:

```text
RHOSTS → Target
RPORT  → Target Port

LHOST  → Attacker/AttackBox
LPORT  → Attacker Listening Port
```

সহজ trick:

```text
R = Remote
L = Local
```

---

# 11. Sessions

Exploit সফল হলে একটি session তৈরি হতে পারে।

Session হলো:

```text
Target ↔ Metasploit
```

এর মধ্যে communication channel।

Active sessions দেখতে:

```bash
sessions
```

---

## Session-এর সঙ্গে interact করা

ধরো session ID হলো `2`:

```bash
sessions -i 2
```

তারপর:

```text
meterpreter >
```

দেখাতে পারে।

---

## Background

Session থেকে বের হয়ে session active রেখে Metasploit console-এ ফিরতে:

```bash
background
```

অথবা:

```text
CTRL + Z
```

---

# 12. Basic Metasploit Workflow

এই flow-টা মনে রাখলেই অনেক কাজ সহজ হবে:

```text
msfconsole
    ↓
search
    ↓
use
    ↓
show options
    ↓
set required values
    ↓
show options
    ↓
run / exploit
    ↓
session
    ↓
sessions -i <ID>
```

---

# 13. Most Important Commands

শেষ মুহূর্তে শুধু এগুলো মনে রাখো:

```text
msfconsole       → Metasploit চালু
search           → Module খোঁজা
use              → Module select
show options     → Options দেখা
set              → Value set
setg             → Global value set
unset            → Value remove
info             → Module details
run              → Module run
exploit          → Exploit run
back             → Context থেকে বের হওয়া
sessions         → Active sessions দেখা
sessions -i ID   → Session-এ ঢোকা
background       → Session background করা
```

---

# 14. One-Minute Revision

```text
Vulnerability = Weakness

Exploit = Vulnerability কাজে লাগায়

Payload = Target-এ code/action চালায়

Auxiliary = Supporting modules

Post = Exploitation-এর পরের কাজ

RHOSTS = Target IP

RPORT = Target Port

LHOST = AttackBox IP

LPORT = AttackBox Listening Port

SESSION = Existing connection ID

set = Current module

setg = Global

_ = Single Payload

/ = Staged Payload

search → use → show options → set → run
```
