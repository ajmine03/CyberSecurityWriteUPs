# git

## এই Section-এ `git` কেন?

`SecLists` repository সংগ্রহ করার জন্য `git clone` ব্যবহার করা হয়েছে।

### Command

```bash
git clone https://github.com/danielmiessler/SecLists
```

## Command Breakdown

| Part | Meaning |
|---|---|
| `git` | Version control tool |
| `clone` | Remote repository-এর local copy তৈরি করে |
| URL | যে repository clone করা হবে |

এই command-এর ফলে `SecLists` repository-এর একটি local copy পাওয়া যায়, যেখান থেকে enumeration-এর জন্য wordlist ব্যবহার করা যায়।

## সম্পর্ক

```text
Git repository
      ↓
SecLists
      ↓
Wordlists
      ↓
GoBuster / অন্যান্য enumeration tools
```
