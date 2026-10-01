# Linux `chmod` Command

## 1. Introduction

`chmod` stands for **Change Mode**. It is a Linux command used to change the permissions of files and directories.

Using `chmod`, we can control who can:
- Read a file (`r`)
- Write or modify a file (`w`)
- Execute a file (`x`)

## 2. Syntax

```bash
chmod [options] permissions filename
```

Example:

```bash
chmod 755 script.sh
```

## 3. Permission Types

| Permission | Symbol | Numeric Value |
|---|---|---|
| Read | r | 4 |
| Write | w | 2 |
| Execute | x | 1 |
| No permission | - | 0 |

### User Categories

- `u` = User (Owner)
- `g` = Group
- `o` = Others
- `a` = All

## 4. Numeric Permissions

Numeric permissions are calculated by adding the values of read, write, and execute.

| Number | Permission |
|---|---|
| 0 | `---` |
| 1 | `--x` |
| 2 | `-w-` |
| 3 | `-wx` |
| 4 | `r--` |
| 5 | `r-x` |
| 6 | `rw-` |
| 7 | `rwx` |

### Example: chmod 755

```bash
chmod 755 file.txt
```

- Owner: `7` = `rwx`
- Group: `5` = `r-x`
- Others: `5` = `r-x`

Result:

```text
-rwxr-xr-x
```

## 5. Common chmod Commands

### Give the owner full permissions

```bash
chmod 700 file.txt
```

### Give everyone read permission

```bash
chmod 444 file.txt
```

### Give everyone read and write permissions

```bash
chmod 666 file.txt
```

### Make a script executable

```bash
chmod +x script.sh
```

### Remove write permission from others

```bash
chmod o-w file.txt
```

### Add write permission to the group

```bash
chmod g+w file.txt
```

### Give everyone read, write, and execute permissions

```bash
chmod 777 file.txt
```

**Warning:** Avoid `777` on sensitive files because it allows everyone to modify and execute them.

## 6. Recursive Permissions

To change permissions for a directory and everything inside it:

```bash
chmod -R 755 myfolder
```

`-R` means recursive.

Be careful when using recursive permissions, especially on system directories.

## 7. Check File Permissions

Use:

```bash
ls -l
```

Example output:

```text
-rwxr-xr-- 1 user group 1024 file.txt
```

Permission breakdown:

- `-` = Regular file
- `rwx` = Owner permissions
- `r-x` = Group permissions
- `r--` = Others permissions

## 8. Symbolic Mode

You can change permissions using letters instead of numbers.

```bash
chmod u+x script.sh
```

Adds execute permission for the owner.

```bash
chmod g-w file.txt
```

Removes write permission from the group.

```bash
chmod o+r file.txt
```

Adds read permission for others.

```bash
chmod a+x script.sh
```

Adds execute permission for everyone.

## 9. Practical Examples

### Example 1: Make a shell script executable

```bash
chmod +x hello.sh
./hello.sh
```

### Example 2: Set private file permissions

```bash
chmod 600 secret.txt
```

Only the owner can read and write the file.

### Example 3: Set directory permissions

```bash
chmod 755 myfolder
```

The owner can read, write, and access the directory. Others can read and access it but cannot modify its contents.

## 10. Important Notes

- `chmod` changes permissions, not file ownership.
- Use `chown` to change file ownership.
- Use `ls -l` to inspect permissions.
- Use `chmod --help` to view command options.
- Be careful with `chmod -R` and `chmod 777`.

## 11. Quick Reference

| Command | Purpose |
|---|---|
| `chmod 755 file` | Owner full; others read and execute |
| `chmod 700 file` | Owner only |
| `chmod 644 file` | Owner read/write; others read |
| `chmod 600 file` | Owner read/write only |
| `chmod +x file` | Add execute permission |
| `chmod -R 755 dir` | Change permissions recursively |
| `ls -l` | View permissions |

---

**Conclusion:** The `chmod` command is an essential Linux tool for managing file and directory access. Understanding numeric and symbolic permissions helps you manage files securely and efficiently.
