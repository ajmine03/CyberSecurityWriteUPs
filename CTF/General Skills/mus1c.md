# mus1c — picoCTF 2019 Writeup

**Category:** General Skills (Medium)  
**Author:** Danny

## Challenge Description

I wrote you a song. Put it in the `academy{}` flag format.

**Challenge file:** [mus1c-lyrics.txt](https://challenge-files.cylabacademy.net/library/d67c9614df4e4d89b88fd6b36560c74a0644cd3ecc3b9c82af762568eb7c875d/mus1c-lyrics.txt)

## Hints

1. Do you think you can master Rockstar?
2. The lyrics can be interpreted as a program in the Rockstar programming language.

## Solution

### 1. Understand the challenge

The challenge provides a text file containing song lyrics. The hint suggests that the lyrics are written in **Rockstar**, an esoteric programming language designed to resemble song lyrics.

The goal is to interpret the lyrics as code and obtain the output.

### 2. Run the Rockstar program

I used the lyrics file as a Rockstar program and executed it with a Rockstar interpreter.

The program produced the following numbers:

```text
114
114
114
111
99
107
110
114
110
48
49
49
51
114
```

### 3. Decode the output using ASCII

The numbers represent ASCII character codes. Converting each number into its corresponding character gives:

| Decimal | Character |
|---:|:---:|
| 114 | r |
| 114 | r |
| 114 | r |
| 111 | o |
| 99 | c |
| 107 | k |
| 110 | n |
| 114 | r |
| 110 | n |
| 48 | 0 |
| 49 | 1 |
| 49 | 1 |
| 51 | 3 |
| 114 | r |

Combining the characters gives:

```text
rrrocknrn0113r
```

### 4. Format the flag

The challenge requires the result to be wrapped in the academy flag format.

## Flag

```text
academy{rrrocknrn0113r}
```

## What I Learned

- Rockstar is an esoteric programming language that uses song-like syntax.
- A text file can contain executable code even when it looks like ordinary lyrics.
- ASCII decimal values can be converted into readable characters to recover a hidden message.

## Conclusion

I solved the challenge by recognizing the lyrics as Rockstar code, running the program to obtain a sequence of decimal numbers, and decoding those numbers into ASCII characters.

The decoded string was `rrrocknrn0113r`, which gave me the final flag:

`academy{rrrocknrn0113r}`
