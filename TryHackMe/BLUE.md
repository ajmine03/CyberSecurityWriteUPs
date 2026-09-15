# TryHackMe Blue

## Overview

**Blue** is a beginner-friendly Windows penetration-testing lab from TryHackMe. The room provides hands-on experience with reconnaissance, vulnerability identification, exploitation, shell access, and post-exploitation.

This README intentionally contains **no flags, answers, credentials, or spoiler information**.

---

## Learning Objectives

By completing this room, you will practice:

* Using Metasploit for exploitation
* Identifying vulnerable services
* Selecting and configuring Metasploit modules
* Working with reverse shells
* Managing sessions in Metasploit
* Upgrading a basic shell to Meterpreter
* Navigating a Windows system after gaining access
* Performing basic post-exploitation enumeration
* Locating important files and directories
* Understanding the relationship between reconnaissance, exploitation, and privilege access

---

## Prerequisites

Recommended knowledge:

* Basic Linux terminal commands
* Basic Windows CMD commands
* Basic networking concepts
* Familiarity with IP addresses and ports
* Basic understanding of Metasploit

You should also have:

* A TryHackMe account
* Access to the Blue room
* A working AttackBox or VPN connection
* A penetration-testing environment such as Kali Linux or Parrot OS

---

## General Workflow

A useful workflow for this room is:

```text
Reconnaissance
↓
Service Enumeration
↓
Vulnerability Identification
↓
Metasploit Module Selection
↓
Exploit Configuration
↓
Initial Shell
↓
Session Management
↓
Meterpreter Upgrade
↓
Post-Exploitation Enumeration
↓
File/System Investigation
```

---

## Metasploit Notes

When working with Metasploit, remember the distinction between:

### Metasploit console

```text
msf >
```

Used for commands such as:

```text
search
use
show options
set
run
sessions
```

### Windows command shell

```text
C:\Windows\system32>
```

This is a Windows CMD environment. Windows commands such as:

```text
dir
type
cd
whoami
```

can be used here.

### Meterpreter

```text
meterpreter >
```

Meterpreter provides additional post-exploitation functionality and has its own command set.

---

## Useful Concepts

### RHOSTS

The remote/target host that Metasploit is communicating with.

### LHOST

The local address that a reverse connection should return to.

When using a TryHackMe VPN, make sure you understand which network interface is being used for the lab connection.

### Payload

A payload determines what happens after successful exploitation. Different payloads can provide different types of sessions.

### Sessions

Metasploit can maintain multiple active sessions. Always check which session you are interacting with before running commands.

---

## Troubleshooting

If an exploit or session does not work:

1. Verify the target IP.
2. Confirm that your VPN connection is active.
3. Check that the relevant service is reachable.
4. Run `show options` before exploiting.
5. Verify required options have been configured.
6. Confirm that the correct payload is selected.
7. Check your local VPN interface and address.
8. Use `sessions` to inspect existing sessions.
9. Avoid accidentally mixing commands between Metasploit, Windows CMD, and Meterpreter.
10. If the lab behaves unexpectedly, restarting the target may resolve temporary issues.

---

## Important Command Context

A common source of confusion is using a command in the wrong environment.

| Prompt          | Environment | Example Commands                |
| --------------- | ----------- | ------------------------------- |
| `msf >`         | Metasploit  | `use`, `set`, `run`, `sessions` |
| `C:\>`          | Windows CMD | `dir`, `type`, `cd`             |
| `meterpreter >` | Meterpreter | `cat`, `search`, `shell`        |

Always look at the prompt before entering a command.

---

## Notes

Use this room to understand the **process**, rather than simply completing the questions.

Pay attention to:

* Why a particular vulnerability is exploitable
* Why a specific module is selected
* Which options are required
* How reverse connections work
* How sessions are created and managed
* Why Meterpreter is useful after obtaining an initial shell
* How post-exploitation enumeration reveals additional information

---

## Spoiler Policy

This README deliberately excludes:

* Flag values
* Flag locations
* Credentials
* Target-specific answers
* Exact exploitation results
* Walkthrough screenshots
* Room question answers

Use the room's own hints and your enumeration results to discover those yourself.

---

## Completion Checklist

* [ ] Connected to the TryHackMe lab
* [ ] Performed reconnaissance
* [ ] Identified the relevant vulnerability
* [ ] Selected the appropriate Metasploit module
* [ ] Configured the required options
* [ ] Obtained an initial shell
* [ ] Backgrounded the shell
* [ ] Upgraded the session
* [ ] Obtained a Meterpreter session
* [ ] Performed post-exploitation enumeration
* [ ] Completed the room questions
* [ ] Documented lessons learned

---

## Further Learning

After completing Blue, consider continuing with other beginner Windows exploitation rooms to reinforce the workflow and compare different exploitation techniques.

**Goal:** understand *why* each step works, not just *which command* to type.
