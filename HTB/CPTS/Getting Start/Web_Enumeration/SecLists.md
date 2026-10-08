# SecLists

## কী?

`SecLists` হলো security testing-এর সময় fuzzing ও enumeration-এর জন্য useful wordlist collection।

এই section-এ `GoBuster`-এর সঙ্গে wordlist source হিসেবে SecLists ব্যবহার করা হয়েছে।

## Install — Git

```bash
git clone https://github.com/danielmiessler/SecLists
```

এটি repository clone করে local copy তৈরি করে।

## Install — APT

```bash
sudo apt install seclists -y
```

এটি package manager-এর মাধ্যমে SecLists install করার source-provided method।

## এই Section-এর গুরুত্বপূর্ণ Wordlist

DNS enumeration:

```text
/usr/share/SecLists/Discovery/DNS/namelist.txt
```

Directory enumeration-এর example-এ:

```text
/usr/share/seclists/Discovery/Web-Content/common.txt
```

ব্যবহার করা হয়েছে।

## সহজভাবে

```text
SecLists
   |
   +-- DNS wordlists
   |
   +-- Web content wordlists
   |
   +-- অন্যান্য security testing lists
```

Wordlist নিজে enumeration করে না; `GoBuster`-এর মতো tool wordlist-এর entries ব্যবহার করে target-এ requests/queries চালায়।
