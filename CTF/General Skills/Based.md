# Based — picoCTF 2019 Writeup

**Category:** General Skills (Medium)  
**Author:** Alex Fulton / Daniel Tunitis

## Challenge Description

To get truly 1337, you must understand different data encodings, such as hexadecimal or binary. Can you get the flag from this program to prove you are on the way to becoming 1337?

**Connection:**

```bash
nc xebec.cylabacademy.net 35594
```

## Solution

### 1. Connect to the server

First, I connected to the challenge using netcat:

```bash
nc xebec.cylabacademy.net 35594
```

The program introduced the challenge and asked me to convert different data encodings into readable words.

### 2. Decode binary to text

The first question was:

```text
Please give the 01100110 01100001 01101100
01100011 01101111 01101110 as a word.
```

The numbers are binary ASCII values. Converting them into characters gives:

```text
falcon
```

I entered `falcon`.

### 3. Decode octal to text

The second question was:

```text
Please give me the
143 157 155 160 165 164 145 162 as a word.
```

These are octal ASCII values. Converting them gives:

```text
computer
```

I entered `computer`.

### 4. Decode hexadecimal to text

The third question was:

```text
Please give me the 6f76656e as a word.
```

The value is hexadecimal. Splitting it into byte pairs:

```text
6f 76 65 6e
```

Converting the bytes into ASCII gives:

```text
oven
```

I entered `oven`.

### 5. Get the flag

After answering all three questions correctly, the server displayed:

```text
You've beaten the challenge

Flag: academy{learning_about_converting_values_e1b0F7D8}
```

## Flag

```text
academy{learning_about_converting_values_e1b0F7D8}
```

## What I Learned

- **Binary:** Base-2 representation, which can encode characters using ASCII.
- **Octal:** Base-8 representation, which can also represent ASCII character codes.
- **Hexadecimal:** Base-16 representation, commonly used to display bytes.
- **Netcat:** How to connect to a remote service and interact with a command-line challenge.

## Conclusion

I solved the challenge by connecting to the server with netcat and converting binary, octal, and hexadecimal values into readable words. After entering all three answers correctly, I received the flag.

**Key takeaway:** Understanding number bases and ASCII makes it easier to decode data and solve encoding challenges.
