# TryHackMe — SQLMap: The Basics

> **Path:** Cyber Security 101 → Offensive Security Tooling  
> **Room:** SQLMap: The Basics  
> **Purpose:** Personal Recap / Revision Notes  
> **Focus:** SQL Injection + SQLMap

---

## 1. What is SQL Injection?

**SQL Injection (SQLi)** is a vulnerability where attacker-controlled input can influence a SQL query executed by the backend database.

### Normal Flow

```text
User Input
    ↓
Web Application
    ↓
SQL Query
    ↓
Database
    ↓
Response
```

### Vulnerable Flow

```text
Malicious Input
      ↓
Web Application
      ↓
Modified SQL Query
      ↓
Database
      ↓
Unexpected Data / Behaviour
```

The core problem is usually **untrusted input being incorporated into SQL queries without proper protection**.

---

# 2. Databases and DBMS

Web applications commonly store information inside databases.

Examples of DBMS:

```text
MySQL
PostgreSQL
SQLite
Microsoft SQL Server
```

Applications communicate with these databases using **SQL — Structured Query Language**.

### Basic Relationship

```text
Web Application
      ↓
      SQL
      ↓
     DBMS
      ↓
   Database
```

---

# 3. SQL Injection Concept

Suppose an application internally creates a query similar to:

```sql
SELECT * FROM users
WHERE username = '<input>';
```

If user input is inserted directly into the query, specially crafted input may alter the intended SQL logic.

### Important Idea

The attacker isn't simply "sending a weird string".

They are attempting to make:

```text
Application Input
        ↓
SQL Parser
        ↓
Interpret attacker-controlled SQL logic
```

---

# 4. Boolean Logic in SQLi

Boolean conditions are commonly useful when testing SQL injection.

Two important operators:

```text
AND
OR
```

### AND

Both conditions must evaluate to true.

```text
TRUE AND TRUE   → TRUE
TRUE AND FALSE  → FALSE
```

### OR

At least one condition must be true.

```text
TRUE OR FALSE   → TRUE
FALSE OR FALSE  → FALSE
```

A classic testing concept is:

```text
1 = 1
```

which evaluates to true.

---

# 5. Types of SQL Injection

SQLMap can test different SQL injection techniques.

Common categories include:

```text
Boolean-based blind
Time-based blind
Error-based
UNION query
Stacked queries
```

### Blind SQL Injection

The application may not directly display database results.

Instead, the attacker observes differences in:

```text
Response content
Response behaviour
Response time
```

### Time-Based Blind SQLi

The attacker can use a database operation that causes a measurable delay.

Conceptually:

```text
Condition TRUE
      ↓
Database delays response
      ↓
Observable timing difference
```

This allows information to be inferred even when database output isn't directly shown.

---

# 6. What is SQLMap?

**SQLMap** is an open-source penetration-testing tool that automates the detection and exploitation of SQL injection vulnerabilities.

Instead of manually testing many SQL injection payloads, SQLMap can automate:

```text
Detection
    ↓
DBMS Fingerprinting
    ↓
Database Enumeration
    ↓
Table Enumeration
    ↓
Column Enumeration
    ↓
Data Extraction
```

It also contains functionality for more advanced database and operating-system interaction.

---

# 7. SQLMap Help

### Basic Help

```bash
sqlmap -h
```

### Advanced Help

```bash
sqlmap -hh
```

### Version

```bash
sqlmap --version
```

### Verbosity

```bash
sqlmap -v 3
```

Verbosity levels help control how much information SQLMap prints.

---

# 8. Targeting a URL

The basic URL option is:

```bash
sqlmap -u "URL"
```

Example structure:

```bash
sqlmap -u "http://TARGET/page.php?id=1"
```

### Important

```text
-u / --url
```

means:

> Specify the target URL.

---

# 9. GET Parameters

A URL may contain parameters such as:

```text
?page.php?id=1
```

Here:

```text
id
```

is the parameter being tested.

Example:

```bash
sqlmap -u "http://TARGET/page.php?id=1"
```

SQLMap can test whether the parameter is injectable.

---

# 10. Selecting a Parameter

If a request contains multiple parameters, you can specify which one SQLMap should test.

```bash
-p parameter
```

Example concept:

```bash
-p username
```

This tells SQLMap to focus on the specified parameter.

### Mental Model

```text
Request
 ├── username
 └── password

        ↓

      -p username

        ↓

Test username
```

---

# 11. POST Requests

Not every parameter is placed in the URL.

Web applications frequently send parameters through HTTP POST requests.

SQLMap can send POST data using:

```bash
--data="parameter=value"
```

Example:

```bash
sqlmap -u "http://TARGET/login" \
       --data="username=test&password=test"
```

### Concept

```text
GET:
URL → ?id=1

POST:
Request Body → username=test&password=test
```

---

# 12. Using a Captured HTTP Request

Instead of manually reconstructing a request, SQLMap can read a complete HTTP request from a file.

```bash
-r request.txt
```

Example:

```bash
sqlmap -r request.txt
```

This is particularly useful when working with:

```text
Burp Suite
Browser requests
Complex POST requests
Cookies
Custom headers
Multiple parameters
```

### Workflow

```text
Browser
   ↓
Intercept Request
   ↓
Save HTTP Request
   ↓
request.txt
   ↓
SQLMap -r
```

---

# 13. Random User-Agent

SQLMap can use a randomly selected User-Agent:

```bash
--random-agent
```

Conceptually:

```text
Normal Request
      ↓
Fixed User-Agent

--random-agent
      ↓
Randomized User-Agent
```

This can be useful during testing when applications treat different User-Agent values differently.

---

# 14. Detection Level

SQLMap provides different levels of testing:

```bash
--level=LEVEL
```

Range:

```text
1 → 5
```

Default:

```text
1
```

Higher levels generally cause SQLMap to perform more extensive tests.

### Remember

```text
level = breadth/depth of testing
```

Don't automatically use the highest value; more tests can mean more requests and longer scans.

---

# 15. Risk Level

SQLMap also provides:

```bash
--risk=RISK
```

Range:

```text
1 → 3
```

Default:

```text
1
```

Risk controls how potentially intrusive the tests are.

### Mental Model

```text
--level
   ↓
How extensively should SQLMap test?

--risk
   ↓
How risky should the tests be?
```

---

# 16. DBMS Fingerprinting

SQLMap attempts to identify the backend database.

For example:

```text
MySQL
PostgreSQL
SQLite
Microsoft SQL Server
```

You can also explicitly specify a DBMS when appropriate:

```bash
--dbms=mysql
```

### Why DBMS Identification Matters

Different database systems have different:

```text
Syntax
Functions
Comments
Metadata
Injection techniques
```

---

# 17. Database Enumeration

Once SQL injection is confirmed, SQLMap can enumerate database information.

### Retrieve DBMS Banner

```bash
--banner
```

### Current Database User

```bash
--current-user
```

### Current Database

```bash
--current-db
```

### List Databases

```bash
--dbs
```

### Check DBA Privileges

```bash
--is-dba
```

---

# 18. Database → Tables → Columns → Data

A useful enumeration hierarchy:

```text
DBMS
 │
 ├── Databases
 │      │
 │      ├── Tables
 │      │      │
 │      │      ├── Columns
 │      │      │      │
 │      │      │      └── Rows / Data
```

Think of SQLMap enumeration as moving down this tree.

---

# 19. Selecting a Database

Use:

```bash
-D DATABASE
```

Example:

```bash
-D example_db
```

This tells SQLMap which database to work with.

---

# 20. Enumerating Tables

Use:

```bash
--tables
```

Combined with a database:

```bash
sqlmap -u "URL" -D example_db --tables
```

Concept:

```text
Database
   ↓
--tables
   ↓
List tables
```

---

# 21. Enumerating Columns

Use:

```bash
--columns
```

With:

```bash
-D DATABASE
-T TABLE
```

Example:

```bash
sqlmap -u "URL" \
       -D example_db \
       -T users \
       --columns
```

### Concept

```text
Database
   ↓
Table
   ↓
Columns
```

---

# 22. Selecting a Table

Use:

```bash
-T TABLE
```

Example:

```bash
-T users
```

So:

```text
-D
 ↓
Database

-T
 ↓
Table
```

---

# 23. Selecting Columns

Use:

```bash
-C column1,column2
```

This allows more focused enumeration instead of retrieving every column.

Conceptually:

```text
users
 ├── id
 ├── username
 ├── email
 └── password
```

You can target specific columns when needed.

---

# 24. Dumping Data

SQLMap can retrieve table entries using:

```bash
--dump
```

Example structure:

```bash
sqlmap -u "URL" \
       -D example_db \
       -T users \
       --dump
```

### Dump All

```bash
--dump-all
```

This attempts to retrieve entries from all available database tables.

### Important Difference

```text
--dump
    ↓
Selected database/table data

--dump-all
    ↓
All accessible database table entries
```

---

# 25. Retrieve Everything

SQLMap provides:

```bash
-a
```

or:

```bash
--all
```

This requests broad enumeration/retrieval of available information.

### Remember

```text
--all = Retrieve everything
```

Use targeted enumeration when you only need specific information.

---

# 26. SQL Shell

SQLMap can provide an interactive SQL shell.

Concept:

```text
sqlmap
   ↓
SQL Shell
   ↓
Interactive SQL Queries
   ↓
Database
```

This is different from an operating-system shell.

### Important Distinction

```text
SQL Shell
   ↓
Database interaction

OS Shell
   ↓
Operating system interaction
```

---

# 27. Operating System Access

SQLMap also has options for interacting with the underlying operating system in certain vulnerable/configured environments.

### OS Shell

```bash
--os-shell
```

### OS Command

```bash
--os-cmd
```

### OS Pwn

```bash
--os-pwn
```

These capabilities depend heavily on the database, privileges, configuration, and target environment.

---

# 28. SQLMap Request Workflow

A typical SQLMap workflow looks like:

```text
1. Identify possible SQLi
          ↓
2. Provide target
          ↓
3. Select vulnerable parameter
          ↓
4. Detect injection
          ↓
5. Identify DBMS
          ↓
6. Enumerate databases
          ↓
7. Enumerate tables
          ↓
8. Enumerate columns
          ↓
9. Extract required data
```

---

# 29. GET-Based Workflow

Generic structure:

```bash
sqlmap -u "http://TARGET/page.php?id=1"
```

Then enumeration:

```bash
sqlmap -u "http://TARGET/page.php?id=1" --dbs
```

Select database:

```bash
sqlmap -u "http://TARGET/page.php?id=1" \
       -D DATABASE --tables
```

Select table:

```bash
sqlmap -u "http://TARGET/page.php?id=1" \
       -D DATABASE \
       -T TABLE \
       --columns
```

Dump:

```bash
sqlmap -u "http://TARGET/page.php?id=1" \
       -D DATABASE \
       -T TABLE \
       --dump
```

---

# 30. POST-Based Workflow

Generic POST request:

```bash
sqlmap -u "http://TARGET/login" \
       --data="username=test&password=test"
```

Focus on one parameter:

```bash
sqlmap -u "http://TARGET/login" \
       --data="username=test&password=test" \
       -p username
```

---

# 31. Request File Workflow

Captured request:

```text
request.txt
```

Run:

```bash
sqlmap -r request.txt
```

Specify parameter:

```bash
sqlmap -r request.txt -p username
```

Enumerate databases:

```bash
sqlmap -r request.txt --dbs
```

Then:

```text
Database
   ↓
Tables
   ↓
Columns
   ↓
Data
```

This approach is useful for complex HTTP requests because the request file can preserve the original request structure.

---

# 32. Useful SQLMap Option Map

| Option | Purpose |
|---|---|
| `-h` | Basic help |
| `-hh` | Advanced help |
| `--version` | Show version |
| `-u` | Target URL |
| `-r` | Read HTTP request from file |
| `--data` | POST data |
| `-p` | Select parameter |
| `--random-agent` | Random User-Agent |
| `--level` | Testing level |
| `--risk` | Testing risk |
| `--dbms` | Specify DBMS |
| `--banner` | DBMS banner |
| `--current-user` | Current DB user |
| `--current-db` | Current database |
| `--dbs` | Enumerate databases |
| `--tables` | Enumerate tables |
| `--columns` | Enumerate columns |
| `--schema` | Enumerate schema |
| `--dump` | Dump selected data |
| `--dump-all` | Dump all accessible table entries |
| `--all` | Retrieve everything |
| `-D` | Select database |
| `-T` | Select table |
| `-C` | Select column |
| `--os-shell` | OS shell |
| `--os-cmd` | Execute OS command |

The room's official material covers these options and their roles.

---

# 33. Practical Challenge Methodology

For the room's practical exercise, the intended learning flow is roughly:

```text
Start Lab Machine
       ↓
Identify target application
       ↓
Inspect request / parameters
       ↓
Identify possible SQL Injection
       ↓
Run SQLMap
       ↓
Confirm injectable parameter
       ↓
Identify DBMS
       ↓
Enumerate databases
       ↓
Enumerate tables
       ↓
Enumerate columns
       ↓
Retrieve relevant information
```

The challenge is based around a vulnerable **blood donation** application and asks the learner to use SQLMap to investigate the SQL injection rather than manually solving the database interaction.

---

# 34. Important Concepts to Remember

### SQL

```text
Structured Query Language
```

Used for interacting with relational databases.

### SQL Injection

```text
Untrusted Input
      ↓
SQL Query
      ↓
Unexpected SQL Behaviour
```

### SQLMap

```text
SQLMap
   ↓
Automates SQL Injection Testing
   ↓
Detection
   ↓
Enumeration
   ↓
Data Extraction
```

### Enumeration Order

```text
DBMS
 ↓
Database
 ↓
Table
 ↓
Column
 ↓
Row/Data
```

---

# 35. Common Mistakes

### Mistake 1 — Using the wrong parameter

If a request contains:

```text
username
password
search
id
```

don't assume all parameters are injectable.

Use:

```bash
-p PARAMETER
```

when you need to focus testing.

---

### Mistake 2 — Confusing `-D` and `-T`

Remember:

```text
-D → Database
-T → Table
-C → Column
```

Easy mnemonic:

```text
D = Database
T = Table
C = Column
```

---

### Mistake 3 — Confusing SQL Shell and OS Shell

```text
SQL Shell
    ↓
Database

OS Shell
    ↓
Operating System
```

They are not the same thing.

---

### Mistake 4 — Immediately using `--dump-all`

First understand the structure:

```text
Databases
    ↓
Tables
    ↓
Columns
    ↓
Required Data
```

Targeted enumeration is generally easier to understand and reduces unnecessary requests.

---

# 36. Quick Revision

```text
SQL
 ↓
Language used to interact with databases

SQLi
 ↓
Manipulating SQL through unsafe input

SQLMap
 ↓
Automates SQL injection testing

-u
 ↓
URL

-r
 ↓
Request file

--data
 ↓
POST data

-p
 ↓
Parameter

--dbs
 ↓
Databases

-D
 ↓
Database

--tables
 ↓
Tables

-T
 ↓
Table

--columns
 ↓
Columns

-C
 ↓
Columns to target

--dump
 ↓
Extract data

--dump-all
 ↓
Extract all accessible table entries

--current-user
 ↓
Current database user

--current-db
 ↓
Current database

--os-shell
 ↓
Operating system shell
```

---

# 37. Final Mental Model

```text
                  WEB APPLICATION
                         │
                         ↓
                    User Input
                         │
                         ↓
                   SQL Query
                         │
                ┌────────┴────────┐
                │                 │
             Secure            Vulnerable
                │                 │
                ↓                 ↓
             Normal             SQLi
                                  │
                                  ↓
                               SQLMap
                                  │
                    ┌─────────────┼─────────────┐
                    ↓             ↓             ↓
                 Detect        Enumerate      Extract
                    │             │             │
                    ↓             ↓             ↓
                  SQLi          DBMS          Data
                                  │
                                  ↓
                              Databases
                                  │
                                  ↓
                                Tables
                                  │
                                  ↓
                               Columns
                                  │
                                  ↓
                                Rows
```

---

## Final Takeaways

- **SQL Injection** happens when attacker-controlled input can influence SQL queries.
- **SQLMap** automates much of the SQLi discovery and enumeration process.
- Start by understanding the **HTTP request and vulnerable parameter**.
- `-u` targets a URL, while `-r` uses a saved HTTP request.
- `--data` is useful for POST parameters.
- `-p` focuses testing on a particular parameter.
- SQLMap enumeration generally follows **DBMS → database → table → column → data**.
- `-D`, `-T`, and `-C` represent **database, table, and column** selection.
- `--dump` extracts selected data; `--dump-all` attempts broader extraction.
- SQL shell and OS shell are fundamentally different.
- For real-world testing, only use SQLMap against systems where you have explicit authorization.

> **Core skill:** Don't memorize SQLMap commands blindly. Understand the request, identify the parameter, understand the database hierarchy, and then choose the SQLMap option that matches the task.
