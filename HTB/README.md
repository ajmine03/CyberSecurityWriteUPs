# Hack The Box (HTB) Notes & Methodologies

Curated penetration testing methodologies, service enumeration playbooks, and tool references aligned with the **Hack The Box Certified Penetration Testing Specialist (CPTS)** curriculum.

---

## CPTS Getting Started & Core Methodologies

<div class="writeup-listing">
  <div class="writeup-listing__header">
    <span class="writeup-listing__col--title">Document / Playbook</span>
    <span class="writeup-listing__col--platform">Platform</span>
    <span class="writeup-listing__col--category">Track</span>
    <span class="writeup-listing__col--difficulty">Type</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Getting%20Started%20-%20Cheatsheet.md" class="writeup-row__title">Getting Started Cheatsheet (PDF)</a>
      <p class="writeup-row__desc">Official reference PDF cheatsheet download and embedded viewer for the CPTS Getting Started module.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">CPTS</span>
    <span class="badge badge--cheatsheet"><span class="badge-dot"></span>Reference</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/HTB_Service_Enumeration_Command.md" class="writeup-row__title">HTB Service Enumeration Commands</a>
      <p class="writeup-row__desc">Practical command line workflows for identifying, auditing, and probing open services across targets.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">CPTS</span>
    <span class="badge badge--medium"><span class="badge-dot"></span>Playbook</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Nmap_HTB.md" class="writeup-row__title">Nmap Scanning Quick Reference</a>
      <p class="writeup-row__desc">Port scanning flags, timing templates, service detection, and NSE vulnerability scripts for lab assessment.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">CPTS</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Reference</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Public%20Exploits.md" class="writeup-row__title">Public Exploits Guide</a>
      <p class="writeup-row__desc">Techniques for discovering and verifying known public exploits using Exploit-DB, Searchsploit, and GitHub.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">CPTS</span>
    <span class="badge badge--medium"><span class="badge-dot"></span>Methodology</span>
  </div>
</div>

---

## Web Enumeration & Tooling

<div class="writeup-listing">
  <div class="writeup-listing__header">
    <span class="writeup-listing__col--title">Tool / Topic</span>
    <span class="writeup-listing__col--platform">Platform</span>
    <span class="writeup-listing__col--category">Focus</span>
    <span class="writeup-listing__col--difficulty">Type</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Web_Enumeration/Web%20Enumeration.md" class="writeup-row__title">Web Enumeration Methodology</a>
      <p class="writeup-row__desc">Structured methodology and reconnaissance checklist for web application penetration testing.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">Web Security</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Overview</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Web_Enumeration/ffuf.md" class="writeup-row__title">ffuf — Fast Web Fuzzing</a>
      <p class="writeup-row__desc">High-speed web fuzzing syntax for directory brute-forcing, parameter discovery, and vhost enumeration.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">Fuzzing</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Tooling</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Web_Enumeration/Gobuster.md" class="writeup-row__title">Gobuster — Directory &amp; DNS Enumeration</a>
      <p class="writeup-row__desc">URI and DNS brute-forcing syntax, pattern matching, and wordlist optimization.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">Directory Enum</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Tooling</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Web_Enumeration/cURL.md" class="writeup-row__title">cURL — Command Line HTTP Requests</a>
      <p class="writeup-row__desc">Inspecting response headers, spoofing User-Agents, following redirects, and testing verbs.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">HTTP Client</span>
    <span class="badge badge--cheatsheet"><span class="badge-dot"></span>Reference</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Web_Enumeration/EyeWitness.md" class="writeup-row__title">EyeWitness — Rapid Triage</a>
      <p class="writeup-row__desc">Automating screenshots, server header analysis, and identifying default credentials at scale.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">Recon</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Tooling</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Web_Enumeration/WhatWeb.md" class="writeup-row__title">WhatWeb — Technology Fingerprinting</a>
      <p class="writeup-row__desc">Recognizing CMS platforms, web servers, JavaScript libraries, and embedded analytics.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">Fingerprinting</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Tooling</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Web_Enumeration/SecLists.md" class="writeup-row__title">SecLists — Essential Wordlists</a>
      <p class="writeup-row__desc">Curated collection of security wordlists for passwords, discovery, fuzzing, and discovery.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">Wordlists</span>
    <span class="badge badge--cheatsheet"><span class="badge-dot"></span>Reference</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Web_Enumeration/SSL-TLS%20Certificates.md" class="writeup-row__title">SSL/TLS Certificates Intelligence</a>
      <p class="writeup-row__desc">Extracting hidden internal domain names, subdomains, and organizational clues from certs.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">Recon</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Guide</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Web_Enumeration/robots.txt.md" class="writeup-row__title">robots.txt Directives</a>
      <p class="writeup-row__desc">Analyzing crawler exclusions to quickly uncover restricted endpoints and administrative consoles.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">Discovery</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Guide</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Web_Enumeration/HTTP%20Status%20Codes.md" class="writeup-row__title">HTTP Status Codes Reference</a>
      <p class="writeup-row__desc">Breakdown of 1xx Informational, 2xx Success, 3xx Redirection, 4xx Client, and 5xx Server codes.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">Standards</span>
    <span class="badge badge--cheatsheet"><span class="badge-dot"></span>Reference</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Web_Enumeration/Web%20Source%20Code.md" class="writeup-row__title">Web Source Code Inspection</a>
      <p class="writeup-row__desc">Auditing client-side HTML, inline JavaScript comments, and hidden input fields for reconnaissance.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">Analysis</span>
    <span class="badge badge--easy"><span class="badge-dot"></span>Guide</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Web_Enumeration/apt.md" class="writeup-row__title">APT Package Management</a>
      <p class="writeup-row__desc">Installing, updating, and managing security packages on Debian and Ubuntu distributions.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">System</span>
    <span class="badge badge--cheatsheet"><span class="badge-dot"></span>Reference</span>
  </div>

  <div class="writeup-row">
    <div class="writeup-row__main">
      <a href="CPTS/Getting%20Start/Web_Enumeration/git.md" class="writeup-row__title">Git Repository Auditing</a>
      <p class="writeup-row__desc">Cloning security repositories and inspecting commit logs for sensitive credentials or keys.</p>
    </div>
    <span class="badge badge--platform">Hack The Box</span>
    <span class="badge badge--category">Tooling</span>
    <span class="badge badge--cheatsheet"><span class="badge-dot"></span>Reference</span>
  </div>
</div>
