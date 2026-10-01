# Plumbing — picoCTF Writeup

**Category:** General Skills

## Challenge Description

Sometimes you need to handle process data outside of a file. Can you find a way to keep the output from this program and search for the flag?

**Connection:**

```bash
nc xebec.cylabacademy.net 34025
```

## Hints

1. Remember the flag format is `academy{XXXX}`.
2. What's a pipe? No, not that kind of pipe!

## Solution

### 1. Connect to the server

First, I connected to the challenge server using netcat:

```bash
nc xebec.cylabacademy.net 34025
```

The program produced a lot of output, making it difficult to find the flag manually.

### 2. Use a pipe and grep

Instead of reading all the output, I used a Linux pipe (`|`) to send the output of `nc` directly to `grep`.

```bash
nc xebec.cylabacademy.net 34025 | grep "academy{"
```

**How it works:**

- `nc` connects to the remote server and receives its output.
- `|` (pipe) passes the output of the first command to the next command.
- `grep "academy{"` searches the incoming text for lines containing the flag prefix.

### 3. Retrieve the flag

The command filtered out the unnecessary output and displayed the matching line:

```text
academy{digital_plumb3r_b7d8A6ea}
```

## Flag

```text
academy{digital_plumb3r_b7d8A6ea}
```

## What I Learned

- How to connect to a remote service using netcat.
- How Linux pipes pass one command's output to another.
- How to use `grep` to search through large amounts of text.
- How to filter program output without saving it to a file.

## Conclusion

I solved the challenge by piping the output of netcat into grep and searching for the known flag format. This made it easy to find the flag without manually reading the noisy output.

**Key takeaway:** Linux pipes and text-filtering tools such as `grep` are useful for quickly finding relevant information in command output.
