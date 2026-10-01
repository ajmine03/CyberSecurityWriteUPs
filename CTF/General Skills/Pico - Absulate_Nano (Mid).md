# ABSOLUTE NANO — picoCTF 2026

**Category:** General Skills (Medium)  
**Author:** Darkraicg492

## Challenge Description

You have complete power with nano. Think you can get the flag?

## Solution

### 1. Connect to the challenge

Connect to the remote server using SSH:

```bash
ssh -p 12539 ctf-player@xebec.cylabacademy.net
```

**Password:** `db275117`

### 2. Check flag permissions

I tried to read `flag.txt` but found that it was accessible only to the root user.

```bash
cat flag.txt
```

### 3. Check sudo permissions

I used `sudo -l` to check which commands my user was allowed to execute with elevated privileges.

```bash
sudo -l
```

The output showed that I could run:

```bash
/bin/nano /etc/sudoers
```

### 4. Edit the sudoers file

Since I had permission to run nano as root, I opened the sudoers file:

```bash
sudo /bin/nano /etc/sudoers
```

I modified the sudoers configuration to grant `ctf-player` unrestricted sudo privileges.

### 5. Read the flag

After changing the permissions, I ran:

```bash
sudo cat flag.txt
```

This allowed me to read the protected flag.

## Flag

```text
academy{n4n0_411_7h3_w4y_cbcceb65}
```

## What I Learned

- How to connect to a remote machine using SSH.
- How to check sudo permissions with `sudo -l`.
- How a misconfigured sudo rule for a text editor can lead to privilege escalation.
- Why granting root access to editors such as nano can be dangerous.

## Conclusion

I solved this challenge by identifying the sudo permission for nano, editing the sudoers file as root, and granting my user unrestricted sudo access. I then used `sudo cat flag.txt` to retrieve the flag.

**Key takeaway:** Allowing a user to run a text editor with root privileges can potentially give them full control over the system.
