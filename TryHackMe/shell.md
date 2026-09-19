# TryHackMe — Shells Overview

> **Path:** Cyber Security 101  
> **Room:** Shells Overview  
> **Purpose:** Personal Recap / Revision Notes

---

## 1. What is a Shell?

A **shell** is an interface that allows a user to interact with an operating system, usually through a command-line interface.

In cybersecurity, a shell can provide command execution on a compromised system.

### Common activities after obtaining shell access

- Remote command execution
- Privilege escalation
- Data discovery/exfiltration
- Persistence
- Post-exploitation
- Pivoting to other systems

### Important Terms

| Term | Meaning |
|---|---|
| Shell | Interface for interacting with an OS |
| Privilege Escalation | Moving from lower privileges to higher privileges |
| Pivoting | Using one compromised system to access other systems |
| Post-Exploitation | Activities performed after gaining access |

---

# 2. Reverse Shell

A **reverse shell** is a shell where the **target initiates the connection back to the attacker/listener**.

### Basic Flow

```text
Target
   |
   |---- outbound connection ---->
   |
Attacker / Listener
```

The attacker first starts a listener, then the target connects back.

### Netcat Listener

```bash
nc -lvnp 443
```

### Options

| Option | Meaning |
|---|---|
| `-l` | Listen mode |
| `-v` | Verbose output |
| `-n` | Disable DNS resolution |
| `-p` | Specify listening port |

Common ports that may be encountered in labs include:

```text
53
80
8080
443
139
445
```

### Concept to Remember

```text
Reverse Shell = Target → Attacker
```

The connection originates from the compromised target.

---

# 3. Named Pipe / FIFO Concept

Some reverse-shell payloads use a **named pipe (FIFO)** to transfer input/output between processes.

Example structure:

```bash
rm -f /tmp/f
mkfifo /tmp/f
```

### What these do

`rm -f /tmp/f`

- Removes an existing file/pipe.

`mkfifo /tmp/f`

- Creates a named pipe.

A named pipe can be used as a communication channel between processes.

### Mental Model

```text
Input
  ↓
Named Pipe
  ↓
Shell
  ↓
Network Connection
  ↓
Listener
```

The important thing for recap is understanding **how stdin/stdout are connected to the network**, rather than memorising one specific payload.

---

# 4. Bind Shell

A **bind shell** works in the opposite direction from a reverse shell.

The compromised target opens a port and waits for an incoming connection.

### Basic Flow

```text
Attacker
   |
   |---- connection ---->
   |
Target listening port
   |
Shell
```

### Concept to Remember

```text
Bind Shell = Attacker → Target
```

The target is acting as the listener.

### Example

A bind shell may listen on a port such as:

```text
8080
```

The attacker can then connect using Netcat:

```bash
nc -nv TARGET_IP 8080
```

### Important Port Rule

Ports below:

```text
1024
```

generally require elevated privileges to bind on Linux.

---

# 5. Reverse Shell vs Bind Shell

| Feature | Reverse Shell | Bind Shell |
|---|---|---|
| Listener | Attacker | Target |
| Connection direction | Target → Attacker | Attacker → Target |
| Target opens listening port | No | Yes |
| Useful when outbound connections work | Yes | Not necessarily |
| Main concept | Connect back | Connect in |

### Easy Memory Trick

```text
Reverse = Target reverses back to you

Bind = Target binds a port and waits
```

---

# 6. Shell Listeners

Netcat is not the only tool that can interact with shells.

Important utilities from the room:

## Rlwrap

`rlwrap` provides readline-style features to programs that normally don't have them.

Example:

```bash
rlwrap nc -lvnp 443
```

Useful features include:

- Arrow-key navigation
- Command history
- Better interactive experience

---

## Ncat

**Ncat** is an enhanced version of Netcat from the Nmap project.

Example:

```bash
ncat -lvnp 4444
```

It provides additional functionality, including SSL support.

Example:

```bash
ncat --ssl -lvnp 4444
```

### Remember

```text
nc     → Netcat
ncat   → Enhanced Netcat from Nmap
rlwrap → Better readline/history interaction
```

---

# 7. Socat

**Socat** is a flexible networking utility that can create connections between two data sources.

Example:

```bash
socat -d -d TCP-LISTEN:443 STDOUT
```

### Important Options

```text
-d       → verbose/debug output
-d -d    → more verbose output
TCP-LISTEN → create TCP listener
STDOUT   → send received data to terminal
```

### Mental Model

```text
Network Socket
      ↓
    Socat
      ↓
   STDOUT
```

---

# 8. Shell Payloads

A **shell payload** is a command/script that exposes a shell through a network connection.

Different languages can be used to create shell payloads.

Common examples covered in the room:

- Bash
- PHP
- Python
- Telnet
- AWK
- BusyBox

---

# 9. Bash Reverse Shell Concepts

Bash can use `/dev/tcp/` to communicate over TCP.

General structure:

```bash
/dev/tcp/ATTACKER_IP/PORT
```

A Bash reverse shell generally performs three things:

```text
1. Create TCP connection
2. Redirect stdin/stdout/stderr
3. Attach shell to the connection
```

### File Descriptors

Linux commonly uses:

```text
0 → stdin
1 → stdout
2 → stderr
```

Understanding these is important when reading reverse-shell payloads.

Example concept:

```text
stdin  ─┐
stdout ─┼──> Network Socket
stderr ─┘
```

---

# 10. PHP Shell Concepts

PHP can create network connections and execute commands through several functions.

Functions discussed in the room include:

```text
exec()
shell_exec()
system()
passthru()
popen()
```

### Important Idea

These functions can be used to execute operating-system commands from PHP when the environment permits it.

For security testing, understand:

```text
PHP
 ↓
Network Socket
 ↓
Command Execution
 ↓
Shell
```

---

# 11. Python Reverse Shell Concepts

Python is commonly used for shell interaction because of its networking and process-control libraries.

Important modules/functions:

```text
socket
subprocess
os
pty
```

### Typical workflow

```text
socket()
   ↓
connect()
   ↓
dup2()
   ↓
stdin/stdout/stderr
   ↓
spawn shell
```

### Important Module

```python
subprocess
```

`subprocess` is commonly used to create and manage processes/commands.

### Remember

Python shell concepts usually involve:

```text
Socket → File Descriptors → Shell
```

---

# 12. Other Shell Payload Techniques

The room also introduces shell techniques involving:

### Telnet

Can be combined with a named pipe to create a command channel.

### AWK

AWK has networking capabilities that can be abused to create shell communication.

### BusyBox

BusyBox provides lightweight Unix utilities, including networking functionality.

Example concept:

```text
BusyBox
   ↓
nc
   ↓
Network Connection
   ↓
Shell
```

---

# 13. Web Shell

A **web shell** is a script hosted on a web server that allows commands to be executed through the web application/server.

Common languages include:

```text
PHP
ASP
JSP
CGI
```

### Basic Architecture

```text
Browser
   |
   | HTTP Request
   ↓
Web Server
   |
   ↓
Web Shell
   |
   ↓
OS Command
```

---

# 14. PHP Web Shell Concept

A simple PHP web shell can receive a command through an HTTP parameter and pass it to a command-execution function.

Conceptually:

```text
HTTP parameter
      ↓
PHP script
      ↓
Command execution
      ↓
Command output
      ↓
HTTP response
```

For example, a request may contain a parameter such as:

```text
?cmd=<command>
```

The important security concept is that **user-controlled input reaches an OS command execution function**.

---

# 15. Web Shell Attack Surface

A web shell may be deployed when an attacker can upload or otherwise place a malicious script on a web server.

Relevant vulnerabilities include:

### Unrestricted File Upload

The application fails to properly restrict uploaded file types/content.

```text
User Upload
    ↓
Insufficient Validation
    ↓
Server accepts executable script
    ↓
Web Shell
```

### Other Possible Entry Points

- File Inclusion
- Command Injection
- Compromised credentials
- Other web application vulnerabilities

---

# 16. Web Shell vs Reverse Shell

| Feature | Web Shell | Reverse Shell |
|---|---|---|
| Access method | HTTP/web application | Network connection |
| Interface | Web request | Shell connection |
| Requires web server | Yes | No |
| Command execution | Through web server | Through shell |
| Typical use | Web application compromise | Remote shell access |

---

# 17. Practical Lab Workflow

For the practical portion, the important workflow is:

```text
Start Lab Machine
       ↓
Identify exposed services
       ↓
Find vulnerable application
       ↓
Identify vulnerability
       ↓
Prepare listener / shell method
       ↓
Trigger vulnerability
       ↓
Obtain shell
       ↓
Verify access
       ↓
Enumerate filesystem
       ↓
Locate required file
```

### Lab Services

The room provides multiple web services for practicing different vulnerabilities.

Typical mapping from the walkthrough:

```text
:8080 → Landing page
:8081 → Command Injection application
:8082 → Unrestricted File Upload application
```

---

# 18. Command Injection → Shell

Conceptually:

```text
Web Application
      ↓
Command Injection
      ↓
Attacker-controlled command
      ↓
Shell Payload
      ↓
Network Connection
      ↓
Listener
      ↓
Shell Access
```

The key thing to understand is that **command injection provides a path from web input to OS command execution**.

Once command execution is available, a shell can potentially be exposed through a network connection.

---

# 19. Unrestricted File Upload → Web Shell

Conceptually:

```text
Upload Function
      ↓
Weak File Validation
      ↓
Executable Script Uploaded
      ↓
Web Server Executes Script
      ↓
Web Shell
      ↓
Command Execution
```

The security issue is not simply "file upload".

The dangerous condition is when the application allows an uploaded file to become **server-side executable code**.

---

# 20. Key Questions — Recap

### Shell Basics

```text
CLI interface for interacting with an OS
→ Shell
```

```text
Using a compromised system to reach other systems
→ Pivoting
```

```text
Moving to higher privileges
→ Privilege Escalation
```

### Reverse / Bind Shell

```text
Target connects back
→ Reverse Shell
```

```text
Target listens for attacker
→ Bind Shell
```

```text
Common listener
→ Netcat
```

```text
Privileged port boundary
→ 1024
```

### Listener Tools

```text
Readline/history enhancement
→ rlwrap
```

```text
Enhanced Netcat from Nmap
→ ncat
```

```text
Flexible socket/network utility
→ socat
```

### Payloads

```text
Common Python process-management module
→ subprocess
```

```text
PHP command-execution payloads
→ exec / shell_exec / system / passthru / popen
```

```text
Scripting language using socket-based reverse shells
→ Python
```

### Web Shell

```text
Weak upload validation
→ Unrestricted File Upload
```

```text
Malicious executable script on web server
→ Web Shell
```

---

# 21. Quick Cheat Sheet

```text
┌──────────────────────────────────────────────┐
│                 SHELLS                       │
├──────────────────────────────────────────────┤
│ Shell          → OS interaction             │
│ Reverse Shell  → Target → Attacker          │
│ Bind Shell     → Attacker → Target          │
│ Web Shell      → HTTP → Server → Command     │
│ Pivoting       → Move through compromised   │
│                  systems                    │
│ PrivEsc        → Gain higher privileges     │
└──────────────────────────────────────────────┘
```

### Tools

```text
nc       → Network connection / listener
ncat     → Enhanced Netcat
rlwrap   → Readline + history
socat    → Flexible socket connections
```

### Languages / Techniques

```text
Bash
PHP
Python
Telnet
AWK
BusyBox
```

---

# 22. Things to Remember

1. **Reverse shell** means the target connects back.
2. **Bind shell** means the target listens for incoming connections.
3. **Netcat** is one of the most common tools for shell listeners.
4. **rlwrap** improves shell interaction with history and readline support.
5. **Ncat** is an enhanced Netcat implementation from Nmap.
6. **Socat** provides flexible socket/data-source connections.
7. Shell payloads commonly manipulate **stdin, stdout and stderr**.
8. **Python sockets** are frequently used for network-based shell communication.
9. **Web shells** execute commands through a compromised web server.
10. **Unrestricted File Upload** becomes especially dangerous when uploaded files can be executed by the server.
11. **Command Injection** can turn web input into OS-level command execution.
12. Understanding the underlying shell mechanism is more important than memorising payload strings.

---

## Final Mental Model

```text
                 INITIAL ACCESS
                       │
          ┌────────────┴────────────┐
          │                         │
   Command Injection        Unrestricted Upload
          │                         │
          ↓                         ↓
    OS Command                 Web Shell
          │                         │
          └────────────┬────────────┘
                       ↓
                 Shell Access
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
      Reverse        Bind         Web
       Shell         Shell        Shell
          │            │            │
          └────────────┴────────────┘
                       ↓
              Post-Exploitation
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       PrivEsc      Discovery    Pivoting
```

> **Goal of the room:** Understand how different shells work, how listeners and payloads interact, and how vulnerabilities such as command injection and unrestricted file upload can lead to shell access.
