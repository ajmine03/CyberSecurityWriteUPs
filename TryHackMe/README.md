# TryHackMe (THM) Walkthroughs & Notes

Comprehensive lab writeups, tool deep-dives, and foundational offensive security notes covering **TryHackMe** rooms and pathways.

---

## All TryHackMe Walkthroughs

<div class="writeup-listing">
  <div class="writeup-listing__header">
    <span class="writeup-listing__col--title">Room / Writeup</span>
    <span class="writeup-listing__col--platform">Platform</span>
    <span class="writeup-listing__col--category">Category</span>
    <span class="writeup-listing__col--difficulty">Difficulty</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="BLUE.md" class="writeup-row__title">Blue</a>
      <p class="writeup-row__desc">Exploiting Windows 7/Server 2008 via MS17-010 (EternalBlue), shell acquisition, and Meterpreter upgrade.</p>
    </div>
    <span class="badge badge--platform">TryHackMe</span>
    <span class="badge badge--category">Windows Exploitation</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Easy</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CVE-2024-21413-Moniker-Link.md" class="writeup-row__title">CVE-2024-21413 — Moniker Link RCE</a>
      <p class="writeup-row__desc">Zero-click Microsoft Outlook vulnerability enabling NTLM hash leakage and remote code execution.</p>
    </div>
    <span class="badge badge--platform">TryHackMe</span>
    <span class="badge badge--category">CVE Analysis</span>
    <span class="badge badge--medium"><span class="badge-dot"></span>Medium</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="BurpSuite.md" class="writeup-row__title">Burp Suite: The Basics</a>
      <p class="writeup-row__desc">Proxy intercept setup, HTTP traffic analysis, Repeater request modification, and Intruder fuzzing.</p>
    </div>
    <span class="badge badge--platform">TryHackMe</span>
    <span class="badge badge--category">Web Tooling</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Easy</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="Metasploit_Exploitation.md" class="writeup-row__title">Metasploit: Practical Exploitation</a>
      <p class="writeup-row__desc">Selecting exploits, staging staged vs inline payloads, establishing handlers, and post-exploitation.</p>
    </div>
    <span class="badge badge--platform">TryHackMe</span>
    <span class="badge badge--category">Exploitation</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Easy</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="Metasploit%20Introduction.md" class="writeup-row__title">Metasploit: Introduction</a>
      <p class="writeup-row__desc">Framework architecture, msfconsole navigation, auxiliary scanners, and basic database setup.</p>
    </div>
    <span class="badge badge--platform">TryHackMe</span>
    <span class="badge badge--category">Frameworks</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Easy</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="SqlMap%20Basic.md" class="writeup-row__title">SQLMap: The Basics</a>
      <p class="writeup-row__desc">Automating SQL injection discovery, DBMS enumeration, database dumping, and OS shell spawning.</p>
    </div>
    <span class="badge badge--platform">TryHackMe</span>
    <span class="badge badge--category">Database Security</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Easy</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="SQL-Fundamental.md" class="writeup-row__title">SQL Fundamentals</a>
      <p class="writeup-row__desc">Relational database query concepts, SELECT statements, WHERE filters, JOINs, and syntax foundation.</p>
    </div>
    <span class="badge badge--platform">TryHackMe</span>
    <span class="badge badge--category">Databases</span>
    <span class="badge badge--cheatsheet"><span class="badge-dot"></span>Fundamentals</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="Gobuster.md" class="writeup-row__title">Gobuster: The Basics</a>
      <p class="writeup-row__desc">Command line URI enumeration, status code filtering, thread configuration, and subdomain discovery.</p>
    </div>
    <span class="badge badge--platform">TryHackMe</span>
    <span class="badge badge--category">Web Recon</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Easy</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="Hydra.md" class="writeup-row__title">Hydra: Password Auditing</a>
      <p class="writeup-row__desc">Brute-force authentication auditing against SSH, FTP, HTTP forms, and basic authentication services.</p>
    </div>
    <span class="badge badge--platform">TryHackMe</span>
    <span class="badge badge--category">Auth Testing</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Easy</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="shell.md" class="writeup-row__title">Shells Overview</a>
      <p class="writeup-row__desc">Reverse shells vs bind shells, netcat listener creation, bash one-liners, and full interactive TTY spawning.</p>
    </div>
    <span class="badge badge--platform">TryHackMe</span>
    <span class="badge badge--category">Shells</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Playbook</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="web-application-basic.md" class="writeup-row__title">Web Application Basics</a>
      <p class="writeup-row__desc">Client-server architecture, HTTP requests and responses, cookies, headers, and authentication tokens.</p>
    </div>
    <span class="badge badge--platform">TryHackMe</span>
    <span class="badge badge--category">Web Concepts</span>
    <span class="badge badge--cheatsheet"><span class="badge-dot"></span>Fundamentals</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="java-script-essentials.md" class="writeup-row__title">JavaScript Essentials</a>
      <p class="writeup-row__desc">Client-side execution context, DOM manipulation, variables, functions, and application debugging.</p>
    </div>
    <span class="badge badge--platform">TryHackMe</span>
    <span class="badge badge--category">Web Scripting</span>
    <span class="badge badge--cheatsheet"><span class="badge-dot"></span>Fundamentals</span>
  </div>
</div>
